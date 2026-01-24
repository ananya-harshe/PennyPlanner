#!/usr/bin/env node

console.log('\n📱 DUOPLANNING - FRONTEND & BACKEND VERIFICATION\n');
console.log('='.repeat(50));

const tests = [
  {
    name: 'Frontend Server',
    url: 'http://localhost:3000',
    port: 3000
  },
  {
    name: 'Backend Health',
    url: 'http://localhost:5001/api/health',
    port: 5001
  },
  {
    name: 'Backend Lessons',
    url: 'http://localhost:5001/api/lessons',
    port: 5001
  },
  {
    name: 'Penny Tips Service',
    url: 'http://localhost:5001/api/penny/tip',
    port: 5001
  }
];

async function testEndpoint(test) {
  try {
    const response = await fetch(test.url, {
      timeout: 3000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${test.name}`);
      if (data.status) console.log(`   └─ Status: ${data.status}`);
      if (Array.isArray(data) && data.length > 0) console.log(`   └─ ${data.length} items returned`);
      if (data.tip) console.log(`   └─ Tip: "${data.tip.substring(0, 50)}..."`);
      return true;
    } else {
      console.log(`⚠️  ${test.name} (HTTP ${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   └─ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🔍 Testing Services...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const success = await testEndpoint(test);
    if (success) passed++;
    else failed++;
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n✨ Both Frontend and Backend are working!\n');
    console.log('🎮 Game Flow Ready:');
    console.log('   • Frontend:  http://localhost:3000');
    console.log('   • Backend:   http://localhost:5001/api');
    console.log('   • Lessons:   http://localhost:5001/api/lessons');
    console.log('   • Quiz:      http://localhost:5001/api/quiz/:lessonId');
    console.log('   • Progress:  http://localhost:5001/api/progress (requires auth)');
    console.log('   • Penny AI:  http://localhost:5001/api/penny/tip\n');
  } else {
    console.log('\n⚠️  Some services are not responding. Check the logs.\n');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
