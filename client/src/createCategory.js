import { categoryService, authService } from './services/api.js';

async function main() {
  try {
    // Login first
    const loginResponse = await authService.login({
      email: 'moniahcode1@gmail.com',
      password: 'MoniahCode'
    });
    console.log('Login successful:', loginResponse);

    // Create category
    const categoryResponse = await categoryService.createCategory({
      name: 'Cybersecurity & Awareness',
      description: 'Articles about digital security, online safety, and cybersecurity awareness'
    });
    console.log('Category created:', categoryResponse);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();