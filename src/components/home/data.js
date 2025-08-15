import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../../public/img/benefit-one.png";
import benefitTwoImg from "../../../public/img/benefit-two.png";

const benefitOne = {
  title: "AI-Powered Code Analysis",
  desc: "Get instant, expert-level code reviews by simply pasting your GitHub repository link. Our AI analyzes your codebase for potential issues, performance bottlenecks, and security vulnerabilities.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Comprehensive Code Review",
      desc: "Receive detailed analysis of your code quality, architecture, and best practices.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Performance Optimization",
      desc: "Identify and fix performance issues before they impact your users.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Security First",
      desc: "Detect potential security vulnerabilities and get recommendations to harden your code.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "For Teams & Solo Developers",
  desc: "Whether you're working on personal projects or collaborating with a team, CodeAnalyzer helps maintain high code quality across your entire organization.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Seamless GitHub Integration",
      desc: "Connect your repositories in seconds and get instant feedback on every push.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Customizable Rules",
      desc: "Tailor the analysis to your team's coding standards and preferences.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Continuous Improvement",
      desc: "Track your progress over time and see your code quality improve with each iteration.",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
