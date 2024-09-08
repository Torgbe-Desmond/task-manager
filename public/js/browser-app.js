document.addEventListener('DOMContentLoaded', function() {
  const taskContainer = document.querySelector('.tasks');
  const loadingText = document.querySelector('.loading-text');
  const taskFormDOM = document.querySelector('.task-form');
  const taskInputDOM = document.querySelector('.task-input');
  const formAlertDOM = document.querySelector('.form-alert');
  const logoutButton = document.getElementById('logoutButton')

  // Handle task form submit
  taskFormDOM.addEventListener('submit', submitTask);

  // Use event delegation for delete buttons
  taskContainer.addEventListener('click', function(e) {
    const deleteButton = e.target.closest('.delete-btn');
    if (deleteButton) {
      const id = deleteButton.getAttribute('data-id');
      deleteTask(id);
    }
  });


  
logoutButton.addEventListener('click', async function(){
  try {
    const response = await axios.post('http://localhost:3000/logout');
    if (response.data.success) {
        window.location.href = '/';
    } else {
        alert('Logout failed. Please try again.');
    }
} catch (error) {
    alert('An error occurred. Please try again.');
}});
});



// function showModal() {
//   document.getElementById('sessionExpiredModal').style.display = 'flex';
// }

// function hideModal() {
//   document.getElementById('sessionExpiredModal').style.display = 'none';
// }

// function handleLogout() {
//   window.location.href = '/ap1/v1/auth';
// }

// window.onload = showModal;

// logoutButton.getElementById('logoutButton').addEventListener('click', () => {
//   handleLogout();
//   hideModal();
// });

// Function to delete a task
async function deleteTask(id) {
  try {
    const response = await axios.delete(`http://localhost:3000/tasks/${id}`);
    
    if (response.status === 200) { 
      const { _id } = response.data;
      document.querySelectorAll('.single-task').forEach(task => {
        if (task.querySelector('.delete-btn').getAttribute('data-id') === _id) {
          task.remove(); 
        }
      });
    } else if (response.status === 401) {
      alert('Your session has expired. Please log in again.');
      window.location.href = '/';    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}


// Form submit handler
async function submitTask(e) {
  e.preventDefault();
  const taskInputDOM = document.querySelector('.task-input');
  const formAlertDOM = document.querySelector('.form-alert');
  
  const name = taskInputDOM.value;
  try {
    const response = await axios.post('http://localhost:3000/tasks', 
      { name });

      if(response.status === 201){
        const { completed, name: taskName, _id: taskID } = response.data;

        // Create the HTML string for the new task
        const newTaskHTML = `
          <div class="single-task ${completed ? 'task-completed' : ''}">
            <h5>
              <span>
                <i class="far fa-check-circle"></i>
              </span>
              ${taskName}
            </h5>
            <div class="task-links">
              <!-- edit link -->
              <a href="/tasks/${taskID}" class="edit-link">
                <i class="fas fa-edit"></i>
              </a>
              <!-- delete btn -->
              <button type="button" class="delete-btn" data-id="${taskID}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
    
        // Insert the new task HTML into the task container
        const taskContainer = document.querySelector('.tasks');
        taskContainer.insertAdjacentHTML('beforeend', newTaskHTML);
        
        // Clear the input field and show success message
        taskInputDOM.value = '';
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Success, task added';
        formAlertDOM.classList.add('text-success');
      } else if(response.status === 401){
        alert('Your session has expired. Please log in again.');
        window.location.href = '/';
      }
  } catch (error) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error, please try again';
  }

  // Hide the alert message after 3 seconds
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
}