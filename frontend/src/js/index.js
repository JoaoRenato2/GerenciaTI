const menuButton = document.getElementById('user-menu-button');
const dropdownMenu = document.getElementById('dropdownMenu');

let isOpen = false;

menuButton.addEventListener('click', toggleMenu);

function toggleMenu() {
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  dropdownMenu.classList.remove('hidden');
  dropdownMenu.classList.add('transition', 'ease-out', 'duration-100', 'transform', 'opacity-0', 'scale-95');
  dropdownMenu.classList.remove('opacity-0', 'scale-95');
  dropdownMenu.classList.add('opacity-100', 'scale-100');

  isOpen = true;

  document.addEventListener('click', closeMenuOnOutsideClick);
}

function closeMenu() {
  dropdownMenu.classList.add('transition', 'ease-in', 'duration-75', 'transform', 'opacity-100', 'scale-100');
  dropdownMenu.classList.remove('opacity-100', 'scale-100');
  dropdownMenu.classList.add('opacity-0', 'scale-95');

  isOpen = false;

  document.removeEventListener('click', closeMenuOnOutsideClick);

  setTimeout(() => {
    dropdownMenu.classList.add('hidden');
  }, 75);
}

function closeMenuOnOutsideClick(event) {
  if (!dropdownMenu.contains(event.target) && event.target !== menuButton) {
    closeMenu();
  }
}
