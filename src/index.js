import {
  findFirstRecordId,
  getRecord,
  getTenantToken,
  sendImage,
  updateRecord,
  uploadMessageImage
} from "./feishu.js";
import { renderSummaryBuffer } from "./render.js";

const config = {
  appId: process.env.FEISHU_APP_ID,
  appSecret: process.env.FEISHU_APP_SECRET,
  appToken: process.env.FEISHU_BITABLE_APP_TOKEN,
  tableId: process.env.FEISHU_TABLE_ID,
  recordId: process.env.RECORD_ID
};

const missing = Object.entries(config)
  .filter(([key, value]) => key !== "recordId" && !value)
  .map(([key]) => key);
if (missing.length) throw new Error(`缺少环境变量：${missing.join(", ")}`);

function asText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => item?.text ?? item?.name ?? "").join("");
  return value == null ? "" : String(value);
}

function formatDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(Number(value) || value);
  return Number.isNaN(date.getTime()) ? asText(value) : date.toISOString().slice(0, 10);
}

function parseExercises(value) {
  return asText(value)
    .split(/[\n；;]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((line) => {
      const natural = line.match(/^(.+?)\s+(\d+)\s*组\s*[×x*]\s*([^×x*]+?)(?:\s*[×x*]\s*(.+))?$/);
      if (natural) {
        return {
          name: natural[1].trim(),
          sets: natural[2].trim(),
          reps: natural[3].trim(),
          weight: natural[4]?.trim() || "—"
        };
      }
      const parts = line.split(/[｜|×x*]/).map((part) => part.trim()).filter(Boolean);
      return {
        name: parts[0] || line,
        sets: (parts[1] || "—").replace(/组$/, ""),
        reps: parts[2] || "—",
        weight: parts[3] || "—"
      };
    });
}

function recipientOpenId(fields) {
  const recipient = fields["接收人"];
  const item = Array.isArray(recipient) ? recipient[0] : recipient;
  return item?.id || item?.open_id;
}

let token;
let recordId = config.recordId;

try {
  token = await getTenantToken(config.appId, config.appSecret);
  recordId ||= await findFirstRecordId(token, config.appToken, config.tableId);
  const record = await getRecord(token, config.appToken, config.tableId, recordId);
  const fields = record.record?.fields ?? record.fields ?? {};
  const openId = recipientOpenId(fields);
  if (!openId) throw new Error("请先在课程记录的“接收人”字段选择你自己");

  await updateRecord(token, config.appToken, config.tableId, recordId, {
    "生成状态": "生成中",
    "错误信息": ""
  });

  const image = await renderSummaryBuffer({
    studentName: asText(fields["学员姓名"]) || "未命名学员",
    courseDate: formatDate(fields["课程日期"]),
    courseNumber: asText(fields["课程节次"]) || "私教课程",
    goal: asText(fields["训练目标"]) || "完成本节训练计划",
    exercises: parseExercises(fields["训练内容"]),
    summary: asText(fields["教练总结"]) || "本节课程已完成。",
    nextPlan: asText(fields["下节计划"]) || "根据本节完成情况调整。",
    coachName: "FOCUS 私教"
  });

  const imageKey = await uploadMessageImage(token, image);
  await sendImage(token, openId, imageKey);
  await updateRecord(token, config.appToken, config.tableId, recordId, {
    "生成状态": "已生成",
    "错误信息": ""
  });
  console.log(`训练总结图片已发送，record_id=${recordId}`);
} catch (error) {
  console.error(error.message);
  if (token && recordId) {
    await updateRecord(token, config.appToken, config.tableId, recordId, {
      "生成状态": "失败",
      "错误信息": String(error.message).slice(0, 500)
    }).catch(() => {});
  }
  process.exitCode = 1;
}
