let students = [];
let mentors = [];

// Load initial data
window.electronAPI.getData().then(data => {
  students = data.students || [];
  mentors = data.mentors || [];
});

// Handle form submission
document.getElementById('data-form').addEventListener('submit', (event) => {
  event.preventDefault();

  console.log('Submit button clicked');

  const type = document.getElementById('type')?.value || '';
  const name = document.getElementById('name')?.value || '';
  const rollNumber = document.getElementById('roll-number')?.value.toUpperCase() || '';
  const phoneNumber = document.getElementById('phone-number')?.value || '';
  const branch = document.getElementById('branch')?.value || '';
  const homeState = document.getElementById('home-state')?.value || '';
  const motherTongue = document.getElementById('mother-tongue')?.value || '';

  const culturalElement = document.getElementById('cultural-hobbies');
  const sportsElement = document.getElementById('sports-hobbies');
  const techElement = document.getElementById('tech-hobbies');

  const cultural = culturalElement ? Array.from(culturalElement.selectedOptions).map(option => option.value) : [];
  const sports = sportsElement ? Array.from(sportsElement.selectedOptions).map(option => option.value) : [];
  const tech = techElement ? Array.from(techElement.selectedOptions).map(option => option.value) : [];

  const clubs = [...cultural, ...sports, ...tech];

  const careerOptionsElement = document.getElementById('career-options');
  const careerOptions = careerOptionsElement ? Array.from(careerOptionsElement.children).map(li => li.textContent.trim()) : [];

  const person = { name, rollNumber, phoneNumber, branch, homeState, motherTongue, clubs, careerOptions };

  if (type === 'student') {
    // Determine role based on roll number
    if (rollNumber.startsWith('24')) {
      person.role = 'mentee';
    } else if (rollNumber.startsWith('23')) {
      person.role = 'co-mentor';
    } else if (rollNumber.startsWith('22')) {
      person.role = 'mentor';
    }
    students.push(person);
  } else {
    mentors.push(person);
  }

  console.log('Person added:', person);
  console.log('Updated students:', students);
  console.log('Updated mentors:', mentors);

  updateDataFile();
  document.getElementById('data-form').reset();
});

// Update data file
function updateDataFile() {
  console.log('Updating data file');
  window.electronAPI.updateData({ students, mentors })
    .then(() => console.log('Data file updated successfully'))
    .catch(err => console.error('Error updating data file:', err));
}

// Drag and Drop functionality
const list = document.getElementById('career-options');
let draggedItem = null;

if (list) {
  list.addEventListener('dragstart', (event) => {
    draggedItem = event.target;
    event.target.classList.add('dragging');
  });

  list.addEventListener('dragend', (event) => {
    event.target.classList.remove('dragging');
    draggedItem = null;
  });

  list.addEventListener('dragover', (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(list, event.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      list.appendChild(draggable);
    } else {
      list.insertBefore(draggable, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
