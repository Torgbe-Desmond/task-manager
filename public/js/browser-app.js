const BASE_URL = 'https://task-manager-lj45.onrender.com';
// const BASE_URL = 'http://localhost:3000';


document.addEventListener('DOMContentLoaded', function() {
  const taskContainer = document.querySelector('.tasks');
  const taskFormDOM = document.querySelector('.task-form');
  const logoutButton = document.getElementById('logoutButton');
  const editLink = document.querySelector('.edit-link')


 editLink.addEventListener('click',function(e){
  const editLink = e.target.closest('.edit-link');
  if (deleteButton) {
    const id = editLink.getAttribute('taskId');
     window.location.href = `${BASE_URL}/tasks/${id}`

  }
 })

  taskFormDOM.addEventListener('submit', submitTask);

  taskContainer.addEventListener('click', function(e) {
    const deleteButton = e.target.closest('.delete-btn');
    if (deleteButton) {
      const id = deleteButton.getAttribute('data-id');
      deleteTask(id);
    }
  });

  logoutButton.addEventListener('click', async function() {
    try {
      const response = await axios.post(`${BASE_URL}/logout`);
      if (response.data.success) {
        window.location.href = BASE_URL;
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  });
});

async function deleteTask(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${id}`);
    
    if (response.status === 200) {
      const { _id } = response.data;
      document.querySelectorAll('.single-task').forEach(task => {
        if (task.querySelector('.delete-btn').getAttribute('data-id') === _id) {
          task.remove();
        }
      });
    } else if (response.status === 401) {
      alert('Your session has expired. Please log in again.');
      window.location.href = BASE_URL;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}


async function submitTask(e) {
  e.preventDefault();
  const taskInputDOM = document.querySelector('.task-input');
  const formAlertDOM = document.querySelector('.form-alert');
  
  const name = taskInputDOM.value;
  try {
    const response = await axios.post(`${BASE_URL}/tasks`, { name });

    if (response.status === 201) {
      const { completed, name: taskName, _id: taskID } = response.data;

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
            <a href="${BASE_URL}/tasks/${taskID}" class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
            <!-- delete btn -->
            <button type="button" class="delete-btn" data-id="${taskID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    

      let taskContainer = document.querySelector('.tasks');
      if (taskContainer.innerHTML.trim() === '') {
        taskContainer.innerHTML = newTaskHTML;
      } else {
        taskContainer.insertAdjacentHTML('beforeend', newTaskHTML);
      }
      
      taskInputDOM.value = '';
      formAlertDOM.style.display = 'block';
      formAlertDOM.textContent = 'Success, task added';
      formAlertDOM.classList.add('text-success');
    } else if (response.status === 401) {
      alert('Your session has expired. Please log in again.');
      window.location.href = BASE_URL;
    }
  } catch (error) {
    console.log('error',error.message)
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error, please try again';
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
}
