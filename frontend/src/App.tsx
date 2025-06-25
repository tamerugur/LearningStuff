import { Header } from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { User } from "./components/User";
import { MainPage } from "./pages/MainPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./index.css";
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/auth" element={<User />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
