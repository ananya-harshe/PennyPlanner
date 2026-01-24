import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5001}/api`;
let authToken = null;
let userId = null;

async function test(name, url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}`);
      return data;
    } else {
      console.log(`⚠️  ${name}: ${data.message || response.statusText}`);
      return data;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🧪 DUOPLANNING API TEST SUITE\n');
  
  // Test 1: Health Check
  console.log('1️⃣  Health & Connectivity Tests');
  await test('Health Check', `${BASE_URL}/health`);
  
  // Test 2: Lessons
  console.log('\n2️⃣  Lesson Tests');
  const lessons = await test('Get All Lessons', `${BASE_URL}/lessons`);
  if (lessons && lessons.length > 0) {
    console.log(`   Found ${lessons.length} lessons`);
    const firstLesson = lessons[0];
    await test(`Get Lesson: ${firstLesson.title}`, `${BASE_URL}/lessons/${firstLesson.id}`);
  }
  
  // Test 3: Authentication
  console.log('\n3️⃣  Authentication Tests');
  
  // Register
  const registerData = await test('Register User', `${BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    })
  });
  
  if (registerData && registerData.token) {
    authToken = registerData.token;
    userId = registerData.user?.id;
    console.log(`   User ID: ${userId}`);
    
    // Test 4: Progress Tracking
    console.log('\n4️⃣  Progress & Game Flow Tests');
    const progress = await test('Get User Progress', `${BASE_URL}/progress`);
    if (progress) {
      console.log(`   XP: ${progress.xp}, Hearts: ${progress.hearts}, Gems: ${progress.gems}`);
    }
    
    // Test 5: Quiz
    console.log('\n5️⃣  Quiz Tests');
    const quiz = await test('Get Quiz for Lesson 1', `${BASE_URL}/quiz/lesson1`);
    if (quiz && quiz.questions) {
      console.log(`   Questions: ${quiz.questions.length}`);
    }
    
    // Test 6: Penny AI
    console.log('\n6️⃣  Penny AI Tests');
    await test('Get Penny Tip', `${BASE_URL}/penny/tip`);
    await test('Get Penny Message (Home)', `${BASE_URL}/penny/message?context=home`);
    await test('Get Penny Message (Learn)', `${BASE_URL}/penny/message?context=learn`);
  }
  
  console.log('\n✨ API Tests Complete!\n');
}

runTests();
