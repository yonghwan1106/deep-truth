const pptxgen = require('pptxgenjs');
const html2pptx = require('C:/Users/user/.claude/skills/pptx/scripts/html2pptx.js');
const path = require('path');

const SLIDES_DIR = 'C:/Users/user/Desktop/공모전/0211_피싱·스캠 예방을 위한 서비스 개발 경진대회/제안2.딥트루스/docs/slides';

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Deep Truth Team';
    pptx.title = 'Deep Truth - AI 딥페이크 음성 검증 서비스';
    pptx.subject = '피싱·스캠 예방을 위한 서비스 개발 경진대회';

    // Slide 1: Title
    console.log('Processing slide 1...');
    await html2pptx(path.join(SLIDES_DIR, 'slide1_improved.html'), pptx);

    // Slide 2: Summary
    console.log('Processing slide 2...');
    await html2pptx(path.join(SLIDES_DIR, 'slide2_improved.html'), pptx);

    // Slide 3: Problem Definition
    console.log('Processing slide 3...');
    const { slide: slide3, placeholders: ph3 } = await html2pptx(path.join(SLIDES_DIR, 'slide3_improved.html'), pptx);

    // Add KPI chart
    if (ph3.length > 0) {
        slide3.addChart(pptx.charts.BAR, [{
            name: 'KPI 목표',
            labels: ['탐지 정확도', '오탐율', '분석시간(초)'],
            values: [95, 5, 10]
        }], {
            ...ph3[0],
            barDir: 'bar',
            showValue: true,
            dataLabelPosition: 'outEnd',
            dataLabelColor: 'FFFFFF',
            chartColors: ['0EA5E9'],
            showLegend: false,
            showCatAxisTitle: false,
            showValAxisTitle: false,
            valAxisHidden: true,
            barGapWidthPct: 50
        });
    }

    // Slide 4: Solution Overview
    console.log('Processing slide 4...');
    await html2pptx(path.join(SLIDES_DIR, 'slide4_improved.html'), pptx);

    // Slide 5: Key Features
    console.log('Processing slide 5...');
    await html2pptx(path.join(SLIDES_DIR, 'slide5_improved.html'), pptx);

    // Slide 6: Data & Tech
    console.log('Processing slide 6...');
    await html2pptx(path.join(SLIDES_DIR, 'slide6_improved.html'), pptx);

    // Slide 7: User Scenario
    console.log('Processing slide 7...');
    const { slide: slide7, placeholders: ph7 } = await html2pptx(path.join(SLIDES_DIR, 'slide7_improved.html'), pptx);

    // Add result chart (doughnut)
    if (ph7.length > 0) {
        slide7.addChart(pptx.charts.DOUGHNUT, [{
            name: '분석 결과',
            labels: ['딥페이크', '정상'],
            values: [94, 6]
        }], {
            ...ph7[0],
            holeSize: 50,
            showPercent: true,
            showLegend: false,
            chartColors: ['EF4444', '334155']
        });
    }

    // Slide 8: Expected Impact
    console.log('Processing slide 8...');
    await html2pptx(path.join(SLIDES_DIR, 'slide8_improved.html'), pptx);

    // Save
    const outputPath = path.join(SLIDES_DIR, '..', 'MVP_제안서_개선.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Presentation saved to: ${outputPath}`);
}

createPresentation().catch(console.error);
