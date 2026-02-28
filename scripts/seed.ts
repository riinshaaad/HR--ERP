import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {
    employees,
    projects,
    leaveRequests,
    leaveBalances,
    payrollRecords,
    performanceRecords
} from '../src/lib/data';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Seeding employees...");
    const { error: empError } = await supabase.from('employees').upsert(
        employees.map(e => ({
            id: e.id,
            name: e.name,
            email: e.email,
            phone: e.phone,
            role: e.role,
            department: e.department,
            job_title: e.jobTitle,
            manager_id: e.managerId,
            start_date: e.startDate,
            salary: e.salary,
            avatar: e.avatar,
            status: e.status,
            skills: e.skills,
            bio: e.bio
        }))
    );
    if (empError) console.error("Error seeding employees:", empError);

    console.log("Seeding projects...");
    const { error: projError } = await supabase.from('projects').upsert(
        projects.map(p => ({
            id: p.id,
            name: p.name,
            client: p.client,
            description: p.description,
            status: p.status,
            progress: p.progress,
            start_date: p.startDate,
            end_date: p.endDate,
            budget: p.budget
        }))
    );
    if (projError) console.error("Error seeding projects:", projError);

    console.log("Seeding project members...");
    const projectMembers = projects.flatMap(p =>
        p.teamIds.map(empId => ({ project_id: p.id, employee_id: empId }))
    );
    const { error: pmError } = await supabase.from('project_members').upsert(projectMembers);
    if (pmError) console.error("Error seeding project members:", pmError);

    console.log("Seeding leave requests...");
    const { error: lrError } = await supabase.from('leave_requests').upsert(
        leaveRequests.map(l => ({
            id: l.id,
            employee_id: l.employeeId,
            type: l.type,
            start_date: l.startDate,
            end_date: l.endDate,
            days: l.days,
            reason: l.reason,
            status: l.status,
            approver_id: l.approverId,
            applied_date: l.appliedDate
        }))
    );
    if (lrError) console.error("Error seeding leave requests:", lrError);

    console.log("Seeding leave balances...");
    const { error: lbError } = await supabase.from('leave_balances').upsert(
        leaveBalances.map(l => ({
            employee_id: l.employeeId,
            annual: l.annual,
            sick: l.sick,
            maternity: l.maternity,
            paternity: l.paternity,
            unpaid: l.unpaid,
            compassionate: l.compassionate
        }))
    );
    if (lbError) console.error("Error seeding leave balances:", lbError);

    console.log("Seeding payroll...");
    const { error: payError } = await supabase.from('payroll_records').upsert(
        payrollRecords.map(p => ({
            id: p.id,
            employee_id: p.employeeId,
            month: p.month,
            year: p.year,
            basic_salary: p.basicSalary,
            allowances: p.allowances,
            deductions: p.deductions,
            tax: p.tax,
            net_pay: p.netPay,
            status: p.status
        }))
    );
    if (payError) console.error("Error seeding payroll:", payError);

    console.log("Seeding performance records...");
    const { error: perfError } = await supabase.from('performance_records').upsert(
        performanceRecords.map(p => ({
            id: p.id,
            employee_id: p.employeeId,
            reviewer_id: p.reviewerId,
            period: p.period,
            kpi_score: p.kpiScore,
            rating: p.rating,
            feedback: p.feedback,
            review_date: p.reviewDate
        }))
    );
    if (perfError) console.error("Error seeding performance:", perfError);

    console.log("Seeding goals...");
    const goalsToInsert = performanceRecords.flatMap(p =>
        p.goals.map(g => ({
            id: g.id,
            performance_record_id: p.id,
            title: g.title,
            description: g.description,
            progress: g.progress,
            due_date: g.dueDate,
            status: g.status
        }))
    );
    const { error: goalsError } = await supabase.from('goals').upsert(goalsToInsert);
    if (goalsError) console.error("Error seeding goals:", goalsError);

    console.log("Seeding complete!");
}

seed().catch(console.error);
