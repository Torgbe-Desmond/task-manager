const BASE_URL = 'https://task-manager-lj45.onrender.com';
// const BASE_URL = 'http://localhost:3000';


document.addEventListener('DOMContentLoaded', function () {
  const taskIDDOM = document.querySelector('.task-edit-id');
  const taskCompletedDOM = document.querySelector('.task-edit-completed');
  const editFormDOM = document.querySelector('.single-task-form');
  const editBtnDOM = document.querySelector('.task-edit-btn');
  const formAlertDOM = document.querySelector('.form-alert');
  let tempName = document.querySelector('.task-edit-name').value;



  editFormDOM.addEventListener('submit', async function (e) {
    e.preventDefault();

    editBtnDOM.textContent = 'Editing...'; 
    try {
      const taskName = document.querySelector('.task-edit-name').value;
      const taskCompleted = taskCompletedDOM.checked;
      const taskID = taskIDDOM.textContent.trim();

      const response = await axios.patch(`${BASE_URL}/tasks/${taskID}`, {
        name: taskName,
        completed: taskCompleted,
      });

      if (response.status === 200) {
        const { data: { task } } = response;
        const { _id: updatedTaskID, completed, name } = task;

        document.querySelector('.task-edit-name').value = name;
        taskCompletedDOM.checked = completed;

        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Success, edited task';
        formAlertDOM.classList.add('text-success');

      } else if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        window.location.href = BASE_URL; 
      }
    } catch (error) {
      console.error(error);
      document.querySelector('.task-edit-name').value = tempName;
      formAlertDOM.style.display = 'block';
      formAlertDOM.textContent = 'Error, please try again';
      formAlertDOM.classList.remove('text-success');
    }

    editBtnDOM.textContent = 'Edit'; 

    setTimeout(() => {
      formAlertDOM.style.display = 'none';
      formAlertDOM.classList.remove('text-success');
    }, 3000);
  });
});
