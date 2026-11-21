import {
  SiCloudflare,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithub,
  SiJavascript,
  SiJupyter,
  SiLangchain,
  SiLanggraph,
  SiLeetcode,
  SiMlflow,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostman,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiTensorflow,
} from "react-icons/si";
import { SiHuggingface, SiKaggle, SiMedium, SiX } from "react-icons/si";
import { FaJava, FaLinkedin } from "react-icons/fa6";

/**
 * Icon registry. The CRM stores only the key (e.g. "python"); unknown keys
 * fall back to a monogram tile in <TechIcon>.
 */
export const TECH_ICONS = {
  python: { Icon: SiPython, color: "#3776AB" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  java: { Icon: FaJava, color: "#ED8B00" },
  sql: { Icon: SiMysql, color: "#4479A1" },
  langchain: { Icon: SiLangchain, color: "#1C3C3C" },
  langgraph: { Icon: SiLanggraph, color: "#ffffff" },
  pytorch: { Icon: SiPytorch, color: "#EE4C2C" },
  tensorflow: { Icon: SiTensorflow, color: "#FF6F00" },
  scikitlearn: { Icon: SiScikitlearn, color: "#F7931E" },
  opencv: { Icon: SiOpencv, color: "#5C3EE8" },
  pandas: { Icon: SiPandas, color: "#e70488" },
  numpy: { Icon: SiNumpy, color: "#4DABCF" },
  mlflow: { Icon: SiMlflow, color: "#0194E2" },
  fastapi: { Icon: SiFastapi, color: "#009688" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  express: { Icon: SiExpress, color: "#ffffff" },
  react: { Icon: SiReact, color: "#61DAFB" },
  nextjs: { Icon: SiNextdotjs, color: "#ffffff" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  cloudflare: { Icon: SiCloudflare, color: "#F38020" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  git: { Icon: SiGit, color: "#F05032" },
  jupyter: { Icon: SiJupyter, color: "#F37626" },
  postman: { Icon: SiPostman, color: "#FF6C37" },
};

export const SOCIAL_ICONS = {
  github: SiGithub,
  linkedin: FaLinkedin,
  leetcode: SiLeetcode,
  x: SiX,
  kaggle: SiKaggle,
  huggingface: SiHuggingface,
  medium: SiMedium,
};
