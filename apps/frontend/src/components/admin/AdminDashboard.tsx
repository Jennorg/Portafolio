import React, { useState, useEffect } from "react";

interface Technology {
  id: string;
  name: string;
  category: string;
  icon: string;
}

interface ProjectTranslation {
  title: string;
  summary: string;
  description: string;
}

interface Project {
  id: string;
  main_image_url: string | null;
  repository_url: string | null;
  live_demo_url: string | null;
  status: string;
  title: string;
  summary: string | null;
  description: string | null;
  technologies: { id: string; name: string }[];
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"es" | "en">("es");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [status, setStatus] = useState("completed");
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  
  const [translations, setTranslations] = useState<Record<"es" | "en", ProjectTranslation>>({
    es: { title: "", summary: "", description: "" },
    en: { title: "", summary: "", description: "" },
  });

  const backendUrl = import.meta.env.PUBLIC_BACKEND_URL || "http://127.0.0.1:3000";

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      window.location.href = "/admin/login";
      return;
    }
    setToken(savedToken);

    // Verify token and fetch data
    verifyAndFetchData(savedToken);
  }, []);

  const verifyAndFetchData = async (authToken: string) => {
    try {
      // 1. Verify
      const verifyRes = await fetch(`${backendUrl}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!verifyRes.ok) {
        throw new Error("Sesión vencida");
      }

      // 2. Fetch Projects and Techs
      const [projectsRes, techsRes] = await Promise.all([
        fetch(`${backendUrl}/api/projects?lang=es`),
        fetch(`${backendUrl}/api/technologies`),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data);
      }
      if (techsRes.ok) {
        const data = await techsRes.json();
        setTechnologies(data);
      }
    } catch (err) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const handleTranslationChange = (
    lang: "es" | "en",
    field: keyof ProjectTranslation,
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const toggleTechnology = (techId: string) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!translations.es.title.trim() && !translations.en.title.trim()) {
      setError("El título del proyecto es obligatorio en al menos un idioma.");
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          main_image_url: mainImageUrl || null,
          repository_url: repositoryUrl || null,
          live_demo_url: liveDemoUrl || null,
          status,
          translations,
          technology_ids: selectedTechIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el proyecto");
      }

      setSuccess("¡Proyecto creado exitosamente!");
      
      // Reset Form
      setMainImageUrl("");
      setRepositoryUrl("");
      setLiveDemoUrl("");
      setStatus("completed");
      setSelectedTechIds([]);
      setTranslations({
        es: { title: "", summary: "", description: "" },
        en: { title: "", summary: "", description: "" },
      });

      // Refetch projects
      const projectsRes = await fetch(`${backendUrl}/api/projects?lang=es`);
      if (projectsRes.ok) {
        setProjects(await projectsRes.json());
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al crear el proyecto");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return;

    setError("");
    setSuccess("");
    setActionLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el proyecto");
      }

      setSuccess("Proyecto eliminado correctamente.");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar el proyecto");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-[var(--color-text-muted)]">Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Panel de Control CMS
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Crea, visualiza y gestiona los proyectos de tu portafolio
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-body)] border border-white/10 hover:border-white/20 transition-all text-sm font-semibold active:scale-[0.98]"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Main CMS Form & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Creation Form */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/5 relative">
          <h2 className="text-xl font-bold mb-6 text-[var(--color-text-body)] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            Crear Nuevo Proyecto
          </h2>

          <form onSubmit={handleCreateProject} className="space-y-6">
            {/* General Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  URL de la Imagen Principal
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Estado del Proyecto
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] focus:outline-none focus:border-primary/50 transition-all text-sm"
                >
                  <option value="completed" className="bg-neutral-900">Completado</option>
                  <option value="in_progress" className="bg-neutral-900">En Progreso</option>
                  <option value="archived" className="bg-neutral-900">Archivado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Enlace de Demo (En vivo)
                </label>
                <input
                  type="url"
                  placeholder="https://mi-demo.com"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Enlace del Repositorio (GitHub)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/usuario/repo"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Translation Tabs */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-xl w-fit border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab("es")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "es"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
                  }`}
                >
                  Español (ES)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "en"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
                  }`}
                >
                  English (EN)
                </button>
              </div>

              {/* Translation Inputs */}
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Título ({activeTab.toUpperCase()}) <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`Título del proyecto en ${activeTab === "es" ? "Español" : "Inglés"}`}
                    value={translations[activeTab].title}
                    onChange={(e) => handleTranslationChange(activeTab, "title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Resumen corto ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    placeholder={`Resumen breve del proyecto en ${activeTab === "es" ? "Español" : "Inglés"}`}
                    value={translations[activeTab].summary}
                    onChange={(e) => handleTranslationChange(activeTab, "summary", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Descripción larga ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`Descripción detallada en ${activeTab === "es" ? "Español" : "Inglés"}`}
                    value={translations[activeTab].description}
                    onChange={(e) => handleTranslationChange(activeTab, "description", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-body)] placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm resize-y"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Technologies Selector */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Tecnologías Utilizadas
              </label>
              {technologies.length === 0 ? (
                <p className="text-xs text-[var(--color-text-muted)]">No hay tecnologías disponibles.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {technologies.map((tech) => {
                    const isSelected = selectedTechIds.includes(tech.id);
                    return (
                      <button
                        type="button"
                        key={tech.id}
                        onClick={() => toggleTechnology(tech.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white/5 border-white/10 text-[var(--color-text-muted)] hover:border-white/20 hover:text-[var(--color-text-body)]"
                        }`}
                      >
                        <div
                          className="w-4 h-4 text-current flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                          dangerouslySetInnerHTML={{ __html: tech.icon }}
                        />
                        <span className="truncate">{tech.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Feedback Messages */}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-center">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {actionLoading ? "Procesando..." : "Crear Proyecto"}
            </button>
          </form>
        </div>

        {/* Existing Projects List */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5 h-fit space-y-6">
          <h2 className="text-xl font-bold text-[var(--color-text-body)]">Proyectos Existentes</h2>

          {projects.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-6">
              No hay proyectos en la base de datos.
            </p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 group justify-between hover:border-white/20 transition-all"
                >
                  <div className="min-w-0 flex-grow">
                    <h3 className="font-bold text-sm text-[var(--color-text-body)] truncate">
                      {project.title || "Sin título"}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] capitalize mt-0.5">
                      Estado: {project.status}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((t) => (
                          <span
                            key={t.id}
                            className="text-[10px] bg-white/5 text-[var(--color-text-muted)] px-2 py-0.5 rounded-full border border-white/5"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={actionLoading}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all text-xs font-semibold self-center active:scale-[0.95] shrink-0"
                    title="Eliminar Proyecto"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
