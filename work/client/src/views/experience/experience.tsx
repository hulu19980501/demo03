import React, { Component, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from "rehype-raw"; // 解析标签，支持html语法
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // 代码高亮
//高亮的主题，还有很多别的主题，可以自行选择
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

import "github-markdown-css";
const Experience: React.FC = () => {
  const [mdContent, setMdContent] = useState("");
  useEffect(() => {
    fetch("README.md")
      .then((res) => res.text())
      .then((text) => setMdContent(text));
  }, []);

  return (
    <ReactMarkdown
      className="markdown-body"
      children={mdContent}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default Experience;
