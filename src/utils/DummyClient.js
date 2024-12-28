import { User, Plan, Task, ErrorLog } from 'karya-client/entities/models.js';
import { PlanStatus, TaskStatus } from 'karya-client/entities/constants.js';
import { GetPlanResponse, GetSummaryResponse } from 'karya-client/client/responses.js';

export class DummyKaryaClient {
    constructor() {
        this.users = new Map(); // Stores users in memory
        this.plans = new Map(); // Stores plans in memory

        this.nextUserId = 1; // Auto-incrementing user ID
        this.nextPlanId = 1; // Auto-incrementing plan ID
    }

    /**
     * Creates a new user.
     * @param {CreateUserRequest} request - The request object containing user creation data.
     * @returns {Promise<User>} - The created user.
     */
    async createUser(request) {
        const user = new User({
            id: `user-${this.nextUserId++}`,
            name: request.name,
            created_at: Date.now(), // Dummy timestamp
        });
        this.users.set(user.name, user);
        return user;
    }

    /**
     * Retrieves the details of a specific user by username.
     * @param {string} username - The username of the user to retrieve.
     * @returns {Promise<User>} - The user object.
     */
    async getUser(username) {
        const user = this.users.get(username);
        if (!user) throw new Error(`User with username '${username}' not found`);
        return user;
    }

    /**
     * Submits a new plan.
     * @param {SubmitPlanRequest} request - The request object containing plan submission data.
     * @returns {Promise<Plan>} - The created plan.
     */
    async submitPlan(request) {
        const plan = new Plan({
            id: `plan-${this.nextPlanId++}`,
            user_id: request.user_id,
            description: request.description,
            period_time: request.period_time,
            type: request.plan_type,
            status: PlanStatus.CREATED,
            max_failure_retry: request.max_failure_retry,
            action: request.action,
            hook: request.hooks,
            parent_plan_id: undefined,
            created_at: Date.now(), // Dummy timestamp
            updated_at: Date.now(), // Dummy timestamp
        });
        this.plans.set(plan.id, plan);
        return plan;
    }

    /**
     * Retrieves the details of a specific plan by ID.
     * @param {string} planId - The ID of the plan to retrieve.
     * @returns {Promise<GetPlanResponse>} - The plan details.
     */
    async getPlan(planId) {
        const plan = this.plans.get(planId);
        if (!plan) throw new Error(`Plan with ID '${planId}' not found`);
        return new GetPlanResponse({
            plan: plan,
            latestTask: new Task('task-123', planId, 5, TaskStatus.PROCESSING, Date.now(), Date.now(), undefined),
        });
    }

    /**
     * Updates an existing plan with new details.
     * @param {UpdatePlanRequest} request - The request object containing updated plan data.
     * @returns {Promise<Plan>} - The updated plan.
     */
    async updatePlan(request) {
        console.log(request)
        const plan = this.plans.get(request.planId);
        if (!plan) throw new Error(`Plan with ID '${request.planId}' not found`);

        // Update only the fields provided in the request
        if (request.periodTime !== undefined) plan.period_time = request.periodTime;
        if (request.maxFailureRetry !== undefined) plan.max_failure_retry = request.maxFailureRetry;
        if (request.hooks !== undefined) plan.hook = request.hooks;
        plan.updated_at = Date.now()

        // Save the updated plan back to the map
        this.plans.set(plan.id, plan);

        return plan;
    }


    /**
     * Cancels a specified plan by ID.
     * @param {string} planId - The ID of the plan to cancel.
     * @returns {Promise<Plan>} - The cancelled plan.
     */
    async cancelPlan(planId) {
        const plan = this.plans.get(planId);
        if (!plan) throw new Error(`Plan with ID '${planId}' not found`);

        plan.status = PlanStatus.CANCELLED;
        return plan;
    }

    /**
     * Retrieves the summary for a specific plan by ID.
     * @param {string} planId - The ID of the plan for which the summary is requested.
     * @returns {Promise<GetSummaryResponse>} - The plan summary.
     */
    async getSummary(planId) {
        const plan = this.plans.get(planId);
        if (!plan) throw new Error(`Summary for plan ID '${planId}' not found`);
        return new GetSummaryResponse({
            plan: plan, tasks: [(new Task('task-123', planId, 5, TaskStatus.SUCCESS, Date.now(), Date.now(), undefined)), (new Task('task-123', planId, 5, TaskStatus.FAILURE, Date.now(), Date.now(), undefined))], errorLogs: [(new ErrorLog(
                planId, // Plan ID
                "Hook execution failed due to a timeout.", // Error message
                new ErrorLog.HookErrorLog(), // Type of error (HookErrorLog)
                Date.now() // Timestamp
            )), (new ErrorLog(
                planId, // Plan ID
                "Task execution failed due to insufficient resources.", // Error message
                new ErrorLog.ExecutorErrorLog("task-456"), // Type of error (ExecutorErrorLog with Task ID)
                Date.now() // Timestamp
            ))]
        });
    }

    /**
     * Retrieves a list of plans associated with a specific user.
     * @param {string} userId - The ID of the user whose plans are to be retrieved.
     * @returns {Promise<Plan[]>} - A list of plans for the user.
     */
    async listPlans(userId) {
        return Array.from(this.plans.values()).filter((plan) => plan.user_id === userId);
    }

    /**
     * Closes the client.
     * This method is a no-op as this implementation is in-memory.
     */
    async close() {
        // No-op for in-memory implementation
    }
}
