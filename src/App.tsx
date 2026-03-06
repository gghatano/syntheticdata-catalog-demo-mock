import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import { RequireAuth } from "./components/layout/RequireAuth";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HrDatasetsPage } from "./pages/hr/HrDatasetsPage";
import { HrDatasetDetailPage } from "./pages/hr/HrDatasetDetailPage";
import { HrCatalogEditPage } from "./pages/hr/HrCatalogEditPage";
import { HrSubmissionsPage } from "./pages/hr/HrSubmissionsPage";
import { HrExecutionDetailPage } from "./pages/hr/HrExecutionDetailPage";
import { HrProposalsPage } from "./pages/hr/HrProposalsPage";
import { HrProposalDetailPage } from "./pages/hr/HrProposalDetailPage";
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
            </Route>
          </Route>

          {/* HR routes */}
          <Route element={<RequireAuth role="hr" />}>
            <Route element={<Layout />}>
              <Route path="/hr/datasets" element={<HrDatasetsPage />} />
              <Route path="/hr/datasets/:id" element={<HrDatasetDetailPage />} />
              <Route path="/hr/datasets/:id/catalog" element={<HrCatalogEditPage />} />
              <Route path="/hr/submissions" element={<HrSubmissionsPage />} />
              <Route path="/hr/executions/:id" element={<HrExecutionDetailPage />} />
              <Route path="/hr/proposals" element={<HrProposalsPage />} />
              <Route path="/hr/proposals/:id" element={<HrProposalDetailPage />} />
            </Route>
          </Route>

          {/* Proposer routes */}
          <Route element={<RequireAuth role="proposer" />}>
            <Route element={<Layout />}>
              <Route path="/proposer/datasets" element={<ProposerDatasetsPage />} />
              <Route path="/proposer/datasets/:id" element={<ProposerDatasetDetailPage />} />
              <Route path="/proposer/submissions" element={<ProposerSubmissionsPage />} />
              <Route path="/proposer/submissions/new" element={<ProposerSubmissionFormPage />} />
              <Route path="/proposer/submissions/:id" element={<ProposerSubmissionDetailPage />} />
              <Route path="/proposer/proposals" element={<ProposerProposalsPage />} />
              <Route path="/proposer/proposals/new" element={<ProposerProposalFormPage />} />
              <Route path="/proposer/proposals/:id" element={<ProposerProposalDetailPage />} />
              <Route path="/proposer/data-requests" element={<DataRequestsPage />} />
              <Route path="/proposer/community" element={<CommunityProposalsPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}
