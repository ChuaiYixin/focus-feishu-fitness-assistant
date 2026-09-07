import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={
  title:"FOCUS 私教训练助手",
  description:"教练课程管理、训练总结与分享图片生成工具。",
  icons:{icon:"/favicon.svg"},
  openGraph:{title:"FOCUS 私教训练助手",description:"记录训练 · 生成总结 · 分享进步",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"FOCUS 私教训练助手",description:"记录训练 · 生成总结 · 分享进步",images:["/og.png"]}
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>}
