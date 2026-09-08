import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage/DashboardPage";

// 其余页面按需加载：首屏不再打包 1MB ECharts 等非必要代码
const KnowledgePage = lazy(() => import("@/pages/KnowledgePage/KnowledgePage"));
const LabConfigPage = lazy(() => import("@/pages/LabConfigPage/LabConfigPage"));
const StudyPlanPage = lazy(() => import("@/pages/StudyPlanPage/StudyPlanPage"));
const QuizPage = lazy(() => import("@/pages/QuizPage/QuizPage"));
const ExamPage = lazy(() => import("@/pages/ExamPage/ExamPage"));
const StatisticsPage = lazy(() => import("@/pages/StatisticsPage/StatisticsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="lab-config" element={<LabConfigPage />} />
        <Route path="study-plan" element={<StudyPlanPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="exam" element={<ExamPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
