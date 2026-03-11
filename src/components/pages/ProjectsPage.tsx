"use client";
import { useState } from "react";
import { projects, getEmployee, Project, employees } from "@/lib/data";
import { useSettings } from "@/contexts/SettingsContext";

function AddProjectModal({ onClose, onAdd, project }: { onClose: () => void, onAdd: (p: Project) => void, project?: Project }) {
    const [name, setName] = useState(project?.name || "");
    const [client, setClient] = useState(project?.client || "");
    const [description, setDescription] = useState(project?.description || "");
    const [startDate, setStartDate] = useState(project?.startDate || "");
    const [endDate, setEndDate] = useState(project?.endDate || "");
    const [teamIds, setTeamIds] = useState<string[]>(project?.teamIds || []);
    const [budget, setBudget] = useState(project?.budget?.toString() || "");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            id: project?.id || `proj-${Date.now()}`,
            name,
            client,
            description,
            status: project?.status || "Active",
            progress: project?.progress || 0,
            startDate,
            endDate,
            budget: Number(budget) || 0,
            teamIds
        });
        onClose();
    };

    const toggleTeamMember = (id: string) => {
        setTeamIds(prev => prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]);
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <span className="modal-title">{project ? "Edit Project" : "New Project"}</span>
                        <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                    </div>
                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Project Name</label>
                            <input required className="input" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Client</label>
                            <input required className="input" value={client} onChange={e => setClient(e.target.value)} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Description</label>
                            <textarea required className="input" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Start Date</label>
                                <input required type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>End Date</label>
                                <input required type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Budget ($)</label>
                                <input required type="number" min="0" className="input" value={budget} onChange={e => setBudget(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Team Memebers</label>
                                <div 
                                    className="input" 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{ width: '100%', minHeight: '38px', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', padding: '6px 12px' }}
                                >
                                    {teamIds.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>Select team...</span> : teamIds.map(id => {
                                        const emp = getEmployee(id);
                                        return (
                                            <span key={id} style={{ background: 'var(--brand-500)', color: 'white', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {emp?.name}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); toggleTeamMember(id); }} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>✕</button>
                                            </span>
                                        );
                                    })}
                                </div>
                                {isDropdownOpen && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', marginTop: '4px', maxHeight: '150px', overflowY: 'auto', zIndex: 10 }}>
                                        {employees.map(emp => (
                                            <div 
                                                key={emp.id} 
                                                onClick={() => toggleTeamMember(emp.id)}
                                                style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: teamIds.includes(emp.id) ? 'var(--bg-hover)' : 'transparent' }}
                                            >
                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{emp.name}</span>
                                                {teamIds.includes(emp.id) && <span style={{ color: 'var(--brand-500)' }}>✓</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{project ? "Save Changes" : "Create Project"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const { formatCurrency } = useSettings();
    const [projectList, setProjectList] = useState<Project[]>(projects);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const filteredProjects = projectList.filter(p => {
        if (filterStatus === "all") return true;
        return p.status === filterStatus;
    });

    const activeCount = projectList.filter(p => p.status === "Active").length;
    const completedCount = projectList.filter(p => p.status === "Completed").length;
    const totalBudget = projectList.reduce((sum, p) => sum + p.budget, 0);

    const handleSaveProject = (updatedProject: Project) => {
        if (editingProject) {
            setProjectList(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        } else {
            setProjectList([updatedProject, ...projectList]);
        }
        setEditingProject(null);
        setIsAddModalOpen(false);
    };

    return (
        <div className="fade-in">
            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: "20px" }}>
                {[
                    { label: "Total Projects", value: projectList.length, icon: "📋", color: "#6366f1" },
                    { label: "Active", value: activeCount, icon: "⏳", color: "#3b82f6" },
                    { label: "Completed", value: completedCount, icon: "✅", color: "#10b981" },
                    { label: "Total Budget", value: formatCurrency(totalBudget), icon: "💰", color: "#f59e0b" },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: `${s.color}18` }}><span>{s.icon}</span></div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Header / Filters */}
            <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="card-title" style={{ margin: 0 }}>Running Projects</div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <select
                            className="input"
                            style={{ padding: "8px" }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="At Risk">At Risk</option>
                        </select>
                        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ New Project</button>
                    </div>
                </div>
            </div>

            {/* Project Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
                {filteredProjects.map(project => (
                    <div key={project.id} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>

                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>{project.name}</h3>
                                    <button 
                                        onClick={() => setEditingProject(project)}
                                        className="btn btn-ghost btn-icon" 
                                        style={{ width: '24px', height: '24px', minHeight: '24px', padding: 0 }}
                                        title="Edit Project"
                                    >
                                        ✎
                                    </button>
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Client: {project.client}</div>
                            </div>
                            <span className={`badge ${project.status === 'Completed' ? 'badge-success' :
                                project.status === 'Active' ? 'badge-info' :
                                    project.status === 'At Risk' ? 'badge-error' : 'badge-warning'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        {/* Description */}
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                            {project.description}
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
                            <div>
                                <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>Timeline</div>
                                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                </div>
                            </div>
                            <div>
                                <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>Budget</div>
                                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>{formatCurrency(project.budget)}</div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                                <span style={{ color: "var(--text-muted)" }}>Progress</span>
                                <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{project.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${project.progress}%`,
                                        background: project.progress === 100 ? "var(--status-success)" : "var(--brand-500)"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Team Members */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Team</div>
                            <div style={{ display: "flex", paddingLeft: "10px" }}>
                                {project.teamIds.map((id, index) => {
                                    const dev = getEmployee(id);
                                    if (!dev) return null;
                                    return (
                                        <div
                                            key={id}
                                            className="avatar avatar-sm"
                                            title={dev.name}
                                            style={{
                                                marginLeft: index === 0 ? 0 : "-8px",
                                                border: "2px solid var(--bg-card)",
                                                fontSize: "10px"
                                            }}
                                        >
                                            {dev.avatar}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-strong)" }}>
                    No projects found for the selected status.
                </div>
            )}

            {(isAddModalOpen || editingProject) && (
                <AddProjectModal
                    project={editingProject || undefined}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingProject(null);
                    }}
                    onAdd={handleSaveProject}
                />
            )}
        </div>
    );
}
