/**
 * Deep Truth PPT 제안서 생성 스크립트
 * HTML 슬라이드를 PowerPoint로 변환
 */

// 글로벌 모듈 경로 추가
const globalModules = process.env.APPDATA + '/npm/node_modules';
module.paths.push(globalModules);

const pptxgen = require('pptxgenjs');
const html2pptx = require('C:/Users/user/.claude/skills/pptx/scripts/html2pptx.js');
const path = require('path');

async function createPresentation() {
  const pptx = new pptxgen();

  // 프레젠테이션 메타데이터
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'Deep Truth - AI 딥페이크 음성 검증 서비스';
  pptx.author = 'Deep Truth Team';
  pptx.subject = '피싱·스캠 예방을 위한 서비스 개발 경진대회';
  pptx.company = 'Deep Truth Team';

  const slidesDir = path.join(__dirname, 'slides');

  console.log('Deep Truth PPT 제안서 생성 시작...');

  // 슬라이드 1: 표지
  console.log('슬라이드 1: 표지 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide1.html'), pptx);

  // 슬라이드 2: Summary
  console.log('슬라이드 2: Summary 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide2.html'), pptx);

  // 슬라이드 3: 문제 정의
  console.log('슬라이드 3: 문제 정의 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide3.html'), pptx);

  // 슬라이드 4: 솔루션 개요
  console.log('슬라이드 4: 솔루션 개요 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide4.html'), pptx);

  // 슬라이드 5: 주요 기능
  console.log('슬라이드 5: 주요 기능 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide5.html'), pptx);

  // 슬라이드 6: 데이터 & 기술
  console.log('슬라이드 6: 데이터 & 기술 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide6.html'), pptx);

  // 슬라이드 7: 사용자 시나리오
  console.log('슬라이드 7: 사용자 시나리오 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide7.html'), pptx);

  // 슬라이드 8: 기대 효과
  console.log('슬라이드 8: 기대 효과 생성 중...');
  await html2pptx(path.join(slidesDir, 'slide8.html'), pptx);

  // PowerPoint 파일 저장
  const outputPath = path.join(__dirname, 'MVP_제안서.pptx');
  await pptx.writeFile({ fileName: outputPath });

  console.log(`\n✅ PPT 생성 완료: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('PPT 생성 오류:', err);
  process.exit(1);
});
