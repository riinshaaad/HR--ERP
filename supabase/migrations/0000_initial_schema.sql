-- Create custom types
CREATE TYPE user_role AS ENUM ('HR Admin', 'Manager', 'Employee');
CREATE TYPE department_type AS ENUM ('Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations');
CREATE TYPE employee_status AS ENUM ('Active', 'On Leave', 'Inactive');
CREATE TYPE project_status AS ENUM ('Active', 'Completed', 'On Hold', 'At Risk');
CREATE TYPE leave_type AS ENUM ('Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Compassionate');
CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE payroll_status AS ENUM ('Paid', 'Pending', 'Processing');
CREATE TYPE performance_rating AS ENUM ('Exceptional', 'Exceeds', 'Meets', 'Needs Improvement', 'Unsatisfactory');
CREATE TYPE goal_status AS ENUM ('In Progress', 'Completed', 'Not Started', 'At Risk');

-- Employees Table
CREATE TABLE public.employees (
    id TEXT PRIMARY KEY,
    user_id UUID UNIQUE, -- linked to auth.users later
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'Employee',
    department department_type,
    job_title TEXT,
    manager_id TEXT REFERENCES public.employees(id),
    start_date DATE,
    salary NUMERIC,
    avatar TEXT,
    status employee_status DEFAULT 'Active',
    skills TEXT[],
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT,
    description TEXT,
    status project_status DEFAULT 'Active',
    progress INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    budget NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Members (Many-to-Many)
CREATE TABLE public.project_members (
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, employee_id)
);

-- Leave Requests Table
CREATE TABLE public.leave_requests (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status leave_status DEFAULT 'Pending',
    approver_id TEXT REFERENCES public.employees(id),
    applied_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Balances Table
CREATE TABLE public.leave_balances (
    employee_id TEXT PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
    annual INTEGER DEFAULT 0,
    sick INTEGER DEFAULT 0,
    maternity INTEGER DEFAULT 0,
    paternity INTEGER DEFAULT 0,
    unpaid INTEGER DEFAULT 0,
    compassionate INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Records Table
CREATE TABLE public.payroll_records (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    basic_salary NUMERIC NOT NULL,
    allowances NUMERIC DEFAULT 0,
    deductions NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    net_pay NUMERIC NOT NULL,
    status payroll_status DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Records Table
CREATE TABLE public.performance_records (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    reviewer_id TEXT REFERENCES public.employees(id),
    period TEXT NOT NULL,
    kpi_score NUMERIC,
    rating performance_rating,
    feedback TEXT,
    review_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals Table
CREATE TABLE public.goals (
    id TEXT PRIMARY KEY,
    performance_record_id TEXT REFERENCES public.performance_records(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0,
    due_date DATE,
    status goal_status DEFAULT 'Not Started',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Basic liberal policies to allow functionality during initial setup
CREATE POLICY "Enable all access for authenticated users" ON public.employees FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.project_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.leave_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.leave_balances FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.payroll_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.performance_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.goals FOR ALL TO authenticated USING (true);
