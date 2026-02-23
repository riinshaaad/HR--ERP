// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = "HR Admin" | "Manager" | "Employee";
export type Department = "Engineering" | "Design" | "Marketing" | "Sales" | "HR" | "Finance" | "Operations";
export type LeaveType = "Annual" | "Sick" | "Maternity" | "Paternity" | "Unpaid" | "Compassionate";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type PerformanceRating = "Exceptional" | "Exceeds" | "Meets" | "Needs Improvement" | "Unsatisfactory";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department: Department;
  jobTitle: string;
  managerId: string | null;
  startDate: string;
  salary: number;
  avatar: string;
  status: "Active" | "On Leave" | "Inactive";
  skills: string[];
  bio: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approverId: string | null;
  appliedDate: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: number;
  sick: number;
  maternity: number;
  paternity: number;
  unpaid: number;
  compassionate: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: "Paid" | "Pending" | "Processing";
}

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  kpiScore: number;
  rating: PerformanceRating;
  goals: Goal[];
  feedback: string;
  reviewDate: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: "In Progress" | "Completed" | "Not Started" | "At Risk";
}

export interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
}

// ─── Mock Employees ───────────────────────────────────────────────────────────

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Sarah Chen",
    email: "sarah.chen@hrx.com",
    phone: "+1 415-555-0101",
    role: "HR Admin",
    department: "HR",
    jobTitle: "HR Director",
    managerId: null,
    startDate: "2019-03-15",
    salary: 120000,
    avatar: "SC",
    status: "Active",
    skills: ["Talent Acquisition", "Compliance", "HRIS", "Employee Relations"],
    bio: "10+ years in HR, passionate about building great workplaces.",
  },
  {
    id: "emp-002",
    name: "James Okafor",
    email: "james.okafor@hrx.com",
    phone: "+1 415-555-0102",
    role: "Manager",
    department: "Engineering",
    jobTitle: "Engineering Manager",
    managerId: "emp-001",
    startDate: "2020-06-01",
    salary: 145000,
    avatar: "JO",
    status: "Active",
    skills: ["React", "Node.js", "Team Leadership", "System Design"],
    bio: "Building scalable systems and high-performing teams.",
  },
  {
    id: "emp-003",
    name: "Priya Sharma",
    email: "priya.sharma@hrx.com",
    phone: "+1 415-555-0103",
    role: "Employee",
    department: "Engineering",
    jobTitle: "Senior Software Engineer",
    managerId: "emp-002",
    startDate: "2021-01-10",
    salary: 115000,
    avatar: "PS",
    status: "Active",
    skills: ["TypeScript", "Golang", "AWS", "PostgreSQL"],
    bio: "Full-stack engineer who loves clean architecture.",
  },
  {
    id: "emp-004",
    name: "Marcus Webb",
    email: "marcus.webb@hrx.com",
    phone: "+1 415-555-0104",
    role: "Employee",
    department: "Design",
    jobTitle: "UI/UX Designer",
    managerId: "emp-002",
    startDate: "2021-08-20",
    salary: 98000,
    avatar: "MW",
    status: "Active",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    bio: "Designing experiences that feel effortless.",
  },
  {
    id: "emp-005",
    name: "Aisha Patel",
    email: "aisha.patel@hrx.com",
    phone: "+1 415-555-0105",
    role: "Manager",
    department: "Marketing",
    jobTitle: "Marketing Manager",
    managerId: "emp-001",
    startDate: "2020-09-15",
    salary: 105000,
    avatar: "AP",
    status: "Active",
    skills: ["Brand Strategy", "Content Marketing", "SEO", "Analytics"],
    bio: "Data-driven marketer who tells compelling brand stories.",
  },
  {
    id: "emp-006",
    name: "David Kim",
    email: "david.kim@hrx.com",
    phone: "+1 415-555-0106",
    role: "Employee",
    department: "Marketing",
    jobTitle: "Content Strategist",
    managerId: "emp-005",
    startDate: "2022-02-14",
    salary: 78000,
    avatar: "DK",
    status: "On Leave",
    skills: ["Copywriting", "SEO", "Social Media", "Email Marketing"],
    bio: "Storyteller at heart, growth hacker by trade.",
  },
  {
    id: "emp-007",
    name: "Lena Müller",
    email: "lena.muller@hrx.com",
    phone: "+1 415-555-0107",
    role: "Employee",
    department: "Finance",
    jobTitle: "Financial Analyst",
    managerId: "emp-001",
    startDate: "2021-05-03",
    salary: 92000,
    avatar: "LM",
    status: "Active",
    skills: ["Financial Modeling", "Excel", "SQL", "Tableau"],
    bio: "Making numbers tell the right story.",
  },
  {
    id: "emp-008",
    name: "Raj Nair",
    email: "raj.nair@hrx.com",
    phone: "+1 415-555-0108",
    role: "Employee",
    department: "Sales",
    jobTitle: "Account Executive",
    managerId: "emp-001",
    startDate: "2022-07-01",
    salary: 85000,
    avatar: "RN",
    status: "Active",
    skills: ["Enterprise Sales", "CRM", "Negotiation", "Salesforce"],
    bio: "Closing deals and building lasting client relationships.",
  },
];

// ─── Mock Leave Requests ──────────────────────────────────────────────────────

export const leaveRequests: LeaveRequest[] = [
  {
    id: "lv-001",
    employeeId: "emp-003",
    type: "Annual",
    startDate: "2026-03-10",
    endDate: "2026-03-14",
    days: 5,
    reason: "Family vacation to Japan",
    status: "Pending",
    approverId: "emp-002",
    appliedDate: "2026-02-20",
  },
  {
    id: "lv-002",
    employeeId: "emp-006",
    type: "Sick",
    startDate: "2026-02-17",
    endDate: "2026-02-21",
    days: 5,
    reason: "Medical procedure recovery",
    status: "Approved",
    approverId: "emp-005",
    appliedDate: "2026-02-15",
  },
  {
    id: "lv-003",
    employeeId: "emp-004",
    type: "Annual",
    startDate: "2026-02-26",
    endDate: "2026-02-27",
    days: 2,
    reason: "Personal matters",
    status: "Approved",
    approverId: "emp-002",
    appliedDate: "2026-02-18",
  },
  {
    id: "lv-004",
    employeeId: "emp-008",
    type: "Annual",
    startDate: "2026-03-20",
    endDate: "2026-03-24",
    days: 5,
    reason: "Travel",
    status: "Pending",
    approverId: "emp-001",
    appliedDate: "2026-02-22",
  },
  {
    id: "lv-005",
    employeeId: "emp-007",
    type: "Sick",
    startDate: "2026-01-08",
    endDate: "2026-01-09",
    days: 2,
    reason: "Flu",
    status: "Approved",
    approverId: "emp-001",
    appliedDate: "2026-01-08",
  },
  {
    id: "lv-006",
    employeeId: "emp-003",
    type: "Annual",
    startDate: "2026-01-20",
    endDate: "2026-01-22",
    days: 3,
    reason: "Extended weekend",
    status: "Rejected",
    approverId: "emp-002",
    appliedDate: "2026-01-15",
  },
];

// ─── Mock Leave Balances ──────────────────────────────────────────────────────

export const leaveBalances: LeaveBalance[] = employees.map((e) => ({
  employeeId: e.id,
  annual: Math.floor(Math.random() * 10 + 10),
  sick: Math.floor(Math.random() * 5 + 5),
  maternity: 90,
  paternity: 14,
  unpaid: 30,
  compassionate: 5,
}));

// ─── Mock Payroll ─────────────────────────────────────────────────────────────

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const payrollRecords: PayrollRecord[] = employees.flatMap((emp) =>
  [1, 2].map((monthOffset, i) => {
    const monthIndex = (new Date().getMonth() - monthOffset + 12) % 12;
    const basic = emp.salary / 12;
    const allowances = basic * 0.15;
    const deductions = basic * 0.05;
    const tax = basic * 0.22;
    const net = basic + allowances - deductions - tax;
    return {
      id: `pay-${emp.id}-${monthOffset}`,
      employeeId: emp.id,
      month: months[monthIndex],
      year: 2026,
      basicSalary: Math.round(basic),
      allowances: Math.round(allowances),
      deductions: Math.round(deductions),
      tax: Math.round(tax),
      netPay: Math.round(net),
      status: i === 0 ? "Paid" : "Pending",
    } as PayrollRecord;
  })
);

// ─── Mock Performance Records ─────────────────────────────────────────────────

export const performanceRecords: PerformanceRecord[] = [
  {
    id: "perf-001",
    employeeId: "emp-003",
    reviewerId: "emp-002",
    period: "Q4 2025",
    kpiScore: 92,
    rating: "Exceptional",
    goals: [
      { id: "g1", title: "Migrate Auth Service", description: "Move to OAuth 2.0", progress: 100, dueDate: "2025-12-31", status: "Completed" },
      { id: "g2", title: "Reduce API Latency", description: "Below 200ms p95", progress: 85, dueDate: "2025-12-31", status: "In Progress" },
    ],
    feedback: "Priya consistently delivers high-quality work and demonstrates strong leadership potential.",
    reviewDate: "2026-01-10",
  },
  {
    id: "perf-002",
    employeeId: "emp-004",
    reviewerId: "emp-002",
    period: "Q4 2025",
    kpiScore: 88,
    rating: "Exceeds",
    goals: [
      { id: "g3", title: "Design System v2", description: "Ship updated component library", progress: 100, dueDate: "2025-12-31", status: "Completed" },
      { id: "g4", title: "Mobile Responsiveness", description: "All pages mobile-ready", progress: 70, dueDate: "2025-12-31", status: "At Risk" },
    ],
    feedback: "Marcus delivered an excellent design system overhaul. Mobile work needs follow-through.",
    reviewDate: "2026-01-11",
  },
  {
    id: "perf-003",
    employeeId: "emp-006",
    reviewerId: "emp-005",
    period: "Q4 2025",
    kpiScore: 75,
    rating: "Meets",
    goals: [
      { id: "g5", title: "Content Calendar", description: "8 weeks of scheduled content", progress: 100, dueDate: "2025-12-31", status: "Completed" },
      { id: "g6", title: "SEO Traffic Growth", description: "+25% organic traffic", progress: 60, dueDate: "2025-12-31", status: "In Progress" },
    ],
    feedback: "David met core targets. Encourage taking initiative on organic growth strategies.",
    reviewDate: "2026-01-12",
  },
  {
    id: "perf-004",
    employeeId: "emp-007",
    reviewerId: "emp-001",
    period: "Q4 2025",
    kpiScore: 95,
    rating: "Exceptional",
    goals: [
      { id: "g7", title: "Budget Variance Report", description: "Monthly automation", progress: 100, dueDate: "2025-12-31", status: "Completed" },
      { id: "g8", title: "Cost Reduction", description: "Identify 3% savings", progress: 100, dueDate: "2025-12-31", status: "Completed" },
    ],
    feedback: "Lena has been outstanding this quarter. Her financial models drove key strategic decisions.",
    reviewDate: "2026-01-13",
  },
  {
    id: "perf-005",
    employeeId: "emp-008",
    reviewerId: "emp-001",
    period: "Q4 2025",
    kpiScore: 81,
    rating: "Exceeds",
    goals: [
      { id: "g9", title: "Q4 Sales Quota", description: "$500K ARR", progress: 96, dueDate: "2025-12-31", status: "Completed" },
      { id: "g10", title: "Enterprise Pipeline", description: "5 qualified opportunities", progress: 80, dueDate: "2025-12-31", status: "In Progress" },
    ],
    feedback: "Raj hit quota and is building a solid enterprise pipeline. Keep momentum.",
    reviewDate: "2026-01-14",
  },
];

// ─── KPI Data ─────────────────────────────────────────────────────────────────

export const teamKPIs: KPI[] = [
  { name: "Avg Performance Score", value: 86.2, target: 80, unit: "pts" },
  { name: "Goals Completed", value: 73, target: 70, unit: "%" },
  { name: "Leave Utilization", value: 62, target: 65, unit: "%" },
  { name: "Employee Satisfaction", value: 4.2, target: 4.0, unit: "/5" },
];

export const performanceTrend = [
  { month: "Aug", score: 78 },
  { month: "Sep", score: 81 },
  { month: "Oct", score: 79 },
  { month: "Nov", score: 84 },
  { month: "Dec", score: 88 },
  { month: "Jan", score: 86 },
];

export const departmentPerformance = [
  { department: "Engineering", score: 90 },
  { department: "Finance", score: 95 },
  { department: "Sales", score: 81 },
  { department: "Design", score: 88 },
  { department: "Marketing", score: 75 },
  { department: "HR", score: 89 },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getEmployee(id: string) {
  return employees.find((e) => e.id === id);
}

export function getLeaveBalance(employeeId: string) {
  return leaveBalances.find((lb) => lb.employeeId === employeeId);
}

export function getEmployeeLeaves(employeeId: string) {
  return leaveRequests.filter((lr) => lr.employeeId === employeeId);
}

export function getEmployeePayroll(employeeId: string) {
  return payrollRecords.filter((pr) => pr.employeeId === employeeId);
}

export function getEmployeePerformance(employeeId: string) {
  return performanceRecords.filter((pr) => pr.employeeId === employeeId);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function ratingColor(rating: PerformanceRating) {
  switch (rating) {
    case "Exceptional": return "#10b981";
    case "Exceeds": return "#3b82f6";
    case "Meets": return "#f59e0b";
    case "Needs Improvement": return "#f97316";
    case "Unsatisfactory": return "#ef4444";
  }
}
