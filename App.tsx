import React from "react";
import { AppProvider } from "./contexts/AppContext";
import { QuestionProvider } from "./contexts/QuestionContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// pages
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import ReviewPage from "./pages/ReviewPage";

// components
import Sidebar from "./components/Sidebar";

// globale styling (indien je Tailwind gebruikt, anders verwijderen)
import "./index.css";

function App() {
  const [page, setPage] = React.useState<"home" | "editor" | "review">("home");
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onStart={() => setPage("editor")} />;
      case "editor":
        return (
          <EditorPage
            onSelectReview={() => setPage("review")}
            onBack={() => setPage("home")}
            onSelectQuestion={(q: any) => {
              setSelectedQuestion(q);
              setPage("review");
            }}
          />
        );
      case "review":
        return (
          <ReviewPage
            question={selectedQuestion}
            onBack={() => setPage("editor")}
          />
        );
      default:
        return <HomePage onStart={() => setPage("editor")} />;
    }
  };

  return (
    <SettingsProvider>
      <AppProvider>
        <QuestionProvider>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar
              current={page}
              onNavigate={(p: any) => setPage(p)}
            />

            <main className="flex-1 p-6">
              {renderPage()}
            </main>
          </div>
        </QuestionProvider>
      </AppProvider>
    </SettingsProvider>
  );
}

export default App;
