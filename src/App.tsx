import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import { RequireAuth } from "./components/layout/RequireAuth";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HrCatalogEditPage } from "./pages/hr/HrCatalogEditPage";
import { HrExecutionDetailPage } from "./pages/hr/HrExecutionDetailPage";
import { ProposerDatasetsPage } from "./pages/proposer/ProposerDatasetsPage";
import { ProposerDatasetDetailPage } from "./pages/proposer/ProposerDatasetDetailPage";
import { ProposerSubmissionsPage } from "./pages/proposer/ProposerSubmissionsPage";
import { ProposerSubmissionFormPage } from "./pages/proposer/ProposerSubmissionFormPage";
import { ProposerSubmissionDetailPage } from "./pages/proposer/ProposerSubmissionDetailPage";
import { ProposerProposalsPage } from "./pages/proposer/ProposerProposalsPage";
import { ProposerProposalFormPage } from "./pages/proposer/ProposerProposalFormPage";
import { ProposerProposalDetailPage } from "./pages/proposer/ProposerProposalDetailPage";
import { DataRequestsPage } from "./pages/proposer/DataRequestsPage";
import { CommunityProposalsPage } from "./pages/proposer/CommunityProposalsPage";
import { ManualPage } from "./pages/manual/ManualPage";
import { HrManualPage } from "./pages/manual/HrManualPage";
import { ProposerManualPage } from "./pages/manual/ProposerManualPage";
import { GlossaryPage } from "./pages/manual/GlossaryPage";

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manual" element={<ManualPage />} />
              <Route path="/manual/hr" element={<HrManualPage />} />
              <Route path="/manual/proposer" element={<ProposerManualPage />} />
              <Route path="/manual/glossary" element={<GlossaryPage />} />

              {/* Datasets */}
              <Route path="/datasets" element={<ProposerDatasetsPage />} />
              <Route path="/datasets/:id" element={<ProposerDatasetDetailPage />} />
              <Route path="/datasets/:id/catalog" element={<HrCatalogEditPage />} />

              {/* Proposals */}
              <Route path="/proposals" element={<ProposerProposalsPage />} />
              <Route path="/proposals/new" element={<ProposerProposalFormPage />} />
              <Route path="/proposals/:id" element={<ProposerProposalDetailPage />} />

              {/* Submissions */}
              <Route path="/submissions" element={<ProposerSubmissionsPage />} />
              <Route path="/submissions/new" element={<ProposerSubmissionFormPage />} />
              <Route path="/submissions/:id" element={<ProposerSubmissionDetailPage />} />

              {/* Executions */}
              <Route path="/executions/:id" element={<HrExecutionDetailPage />} />

              {/* Data Requests & Community */}
              <Route path="/data-requests" element={<DataRequestsPage />} />
              <Route path="/community" element={<CommunityProposalsPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}
