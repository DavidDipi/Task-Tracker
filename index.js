import readline from 'node:readline';
import fs from 'fs';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Convert questions in promises
const question = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

// Great input
const greattings = async () => {
    const name = await question("\nWhat's your name? -> ");
    console.log(`\nHi ${name}, welcome to Task Tracker app!`);
    console.log(`\nBasic commands.`);
    console.log(`\nadd <task> - Add a new task`);
    console.log(`update <id> <task> - Update a task`);
    console.log(`delete <id> - Delete a task`);
};

// Add task to Json file
const addTask = (task) => {
    const filePath = 'tasks.json';

    // File exists?
    if (!fs.existsSync(filePath)) {
        const initialData = { tasks: [] };
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const tasks = JSON.parse(data);

    // Create new task}
    let id = 1;
    if (tasks.tasks.length === 0) { 
        id = 1 
    } else {   
        const lastId = tasks.tasks[tasks.tasks.length - 1];
        id = lastId.id + 1
    }

    const newTask = { id: id, description: task };

    // Add task to array
    tasks.tasks.push(newTask);

    // Write file
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');

    console.log(`Task added successfully (ID: ${id})`);
};

// Delete task to Json file
const deleteTask = (idToDelete) => {
    const filePath = 'tasks.json';

    // File exists?
    if (!fs.existsSync(filePath)) {
        const initialData = { tasks: [] };
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const tasks = JSON.parse(data);

    // Delete task to array
    if (Array.isArray(tasks.tasks)) {
        const index = tasks.tasks.findIndex(task => task.id == idToDelete);
        if (index !== -1) {
            tasks.tasks.splice(index, 1);
            fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
            console.log(`Task deleted successfully (ID: ${idToDelete})`);
        } else {
            console.error(`Task with ID ${idToDelete} not found.`)
        }


    } else {
        console.error("tasks no es un array.");
    }
};

// Promp task
const promptUser = async () => {
    rl.question(`\nEnter command: `, (input) => {
        const [action, ...params] = input.split(' ');
        const task = params.join(' ');
        
        switch (action) {
            case 'add':
                if (task) {
                    addTask(task)
                } else {
                    console.log('Please provide a task to add.');
                }
                break;
            case 'update':
                const [id, ...taskToUpdate] = task.split(' ');
                const updatedTask = taskToUpdate.join(' '); // Tarea actualizada
                if (id && updatedTask) {
                    console.log(`Updating task #${id} to: "${updatedTask}"`);
                } else {
                    console.log('Please provide task ID and updated task.');
                }
                break;
            case 'delete':
                if (task) {
                    deleteTask(task)
                } else {
                    console.log('Please provide a task ID to delete.');
                }
                break;
            default:
                console.log('Command not recognized.');
                break;
        }
        
        promptUser(); // Ask for another command
    });
};

// App init
const startApp = async () => {
    await greattings()

    await promptUser()
};

startApp();

