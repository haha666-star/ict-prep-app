import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage/DashboardPage";
import KnowledgePage from "@/pages/KnowledgePage/KnowledgePage";
import LabConfigPage from "@/pages/LabConfigPage/LabConfigPage";
import StudyPlanPage from "@/pages/StudyPlanPage/StudyPlanPage";
import QuizPage from "@/pages/QuizPage/QuizPage";
import StatisticsPage from "@/pages/StatisticsPage/StatisticsPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="lab-config" element={<LabConfigPage />} />
        <Route path="study-plan" element={<StudyPlanPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
