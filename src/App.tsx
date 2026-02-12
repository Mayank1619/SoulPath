import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GuidanceProvider } from "./context/GuidanceContext";
import { PageShell } from "./components/PageShell";
import { Landing } from "./pages/Landing";
import { Categories } from "./pages/Categories";
import { BirthDetails } from "./pages/BirthDetails";
import { PalmUpload } from "./pages/PalmUpload";
import { Resonance } from "./pages/Resonance";
import { Results } from "./pages/Results";
import { Chatbot } from "./pages/Chatbot";
import { HowItWorks } from "./pages/HowItWorks";

export default function App() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const stored = localStorage.getItem("soulpath-theme");
        if (stored === "dark") {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("soulpath-theme", theme);
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <BrowserRouter>
            <GuidanceProvider>
                <PageShell theme={theme} onToggleTheme={handleToggleTheme}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/birth-details" element={<BirthDetails />} />
                        <Route path="/palm-upload" element={<PalmUpload />} />
                        <Route path="/resonance" element={<Resonance />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/chatbot" element={<Chatbot />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </PageShell>
            </GuidanceProvider>
        </BrowserRouter>
    );
}
