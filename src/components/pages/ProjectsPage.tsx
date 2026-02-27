"use client";
import { useState } from "react";
import { projects, getEmployee, formatCurrency, Project } from "@/lib/data";

function AddProjectModal({ onClose, onAdd }: { onClose: () => void, onAdd: (p: Project) => void }) {
    const [name, setName] = useState("");
    const [client, setClient] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            id: `proj-${Date.now()}`,
            name,
            client,
            description,
            status: "Active",
            progress: 0,
            startDate,
            endDate,
            budget: Number(budget) || 0,
            teamIds: [] // Default to empty team, can be assigned later
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <span className="modal-title">New Project</span>
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
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 500 }}>Budget ($)</label>
                            <input required type="number" min="0" className="input" value={budget} onChange={e => setBudget(e.target.value)} style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const [projectList, setProjectList] = useState<Project[]>(projects);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredProjects = projectList.filter(p => {
        if (filterStatus === "all") return true;
        return p.status === filterStatus;
    });

    const activeCount = projectList.filter(p => p.status === "Active").length;
    const completedCount = projectList.filter(p => p.status === "Completed").length;
    const totalBudget = projectList.reduce((sum, p) => sum + p.budget, 0);

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
                            <div>
                                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>{project.name}</h3>
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

            {isAddModalOpen && (
                <AddProjectModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={(newProject) => setProjectList([newProject, ...projectList])}
                />
            )}
        </div>
    );
}
