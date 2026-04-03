const btn = document.querySelector('.nature_icon-btn');
const box = document.querySelector('.nature_float-box');
const noteTitles = document.querySelectorAll('.note-title');
const noteItems = document.querySelectorAll('.note-item');
const tempChart = document.querySelector('.temp-chart-container');
const Qingling = document.querySelector('.Qingling-note');
const Daba = document.querySelector('.Daba-note');
const Cold = document.querySelector('.Cold');
const Coldnote = document.querySelector('.Cold-note');
const Mounnote = document.querySelector('.Moun-note');
const Citynote = document.querySelector('.City-note');
const Chongqing = document.querySelector('.Chongqing');

// 全局保存图表实例，防止冲突
let temperatureChartInstance = null;
let precipitationChartInstance = null;

// 点击按钮：切换状态
btn.addEventListener('click', function () {
    btn.classList.toggle('active');
    box.classList.toggle('show');
    // 关闭弹窗 → 隐藏所有标注 + 隐藏图表
    if(!box.classList.contains('show')){
        noteItems.forEach(item => item.classList.remove('active'));
        tempChart.classList.remove('show');
        Qingling.classList.remove('show')
        Daba.classList.remove('show')
        Cold.classList.remove('show')
        Coldnote.classList.remove('show')
        Mounnote.classList.remove('show')
        Citynote.classList.remove('show')
        Chongqing.classList.remove('show')
    }
});

noteItems.forEach((title, index) => {
    title.addEventListener('click', () => {
        // 清空+显示对应标注
        noteItems.forEach(item => item.classList.remove('active'));
        noteItems[index].classList.add('active');
        tempChart.classList.toggle('show', index === 0);
        Qingling.classList.toggle('show',index === 0)
        Daba.classList.toggle('show',index === 0)
        Cold.classList.toggle('show',index === 0)
        Coldnote.classList.toggle('show',index === 0)
        Citynote.classList.toggle('show',index === 0)
        Mounnote.classList.toggle('show',index === 0)
        Chongqing.classList.toggle('show',index === 0)
    });
});

// 标签页切换功能
function initChartTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 切换标签激活状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 获取目标图表ID
            const targetId = tab.getAttribute('data-target');
            // 隐藏所有图表
            document.querySelectorAll('.chart-canvas').forEach(canvas => {
                canvas.style.display = 'none';
            });
            // 显示目标图表
            document.getElementById(targetId).style.display = 'block';
        });
    });
}

// ====================== 双图表初始化（气温+降水量） ======================
window.addEventListener('load', function () {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    // 1. 气温数据（原有）
    const avgHighTemp = [11,14,18,23,27,29,33,33,28,22,17,12];
    const avgLowTemp = [7,8,12,17,20,23,26,26,22,17,13,8];

    // 2. 降水量数据（新增 柱状图）
    const precipitationData = [7.5,11.4,33.6,75.6,120.2,163.0,143.6,120.1,99.4,64.1,29.7,13.5];

    // —— 初始化 气温折线图 ——
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    const areaGradient = tempCtx.createLinearGradient(0, 0, 0, 200);
    areaGradient.addColorStop(0, 'rgba(255, 154, 60, 0.15)');
    areaGradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

    temperatureChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '平均高温',
                    data: avgHighTemp,
                    borderColor: '#ff9a3c',
                    backgroundColor: areaGradient,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ff9a3c',
                    fill: '+1',
                    tension: 0.3,
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: '#f0f0e6',
                        font: { size: 10, weight: 'bold' },
                        formatter: (value) => `${value}°`
                    }
                },
                {
                    label: '平均低温',
                    data: avgLowTemp,
                    borderColor: '#36a2eb',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#36a2eb',
                    fill: false,
                    tension: 0.3,
                    datalabels: {
                        anchor: 'end',
                        align: 'bottom',
                        color: '#f0f0e6',
                        font: { size: 10, weight: 'bold' },
                        formatter: (value) => `${value}°`
                    }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: 'transparent',
            layout: { padding: { top: 5, right: 5, bottom: 2, left: 5 } },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        color: '#f0f0e6',
                        font: { size: 9 },
                        padding: 5,
                        usePointStyle: true
                    }
                },
                tooltip: { enabled: true },
                datalabels: { display: true }
            },
            scales: {
                y: { beginAtZero: true, min: 0, max: 40, grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#d0d0c8', font: { size: 9 }, stepSize: 10 } },
                x: { grid: { display: false }, ticks: { color: '#d0d0c8', font: { size: 9 }, maxRotation: 0, minRotation: 0 } }
            },
            animation: { duration: 500 }
        },
        plugins: [ChartDataLabels]
    });

    // —— 初始化 降水量柱状图（新增） ——
    const precipCtx = document.getElementById('precipitationChart').getContext('2d');
    precipitationChartInstance = new Chart(precipCtx, {
        type: 'bar', // 柱状图
        data: {
            labels: months,
            datasets: [{
                label: '月均降水量(mm)',
                data: precipitationData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)', // 蓝色柱状
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4, // 圆角柱子
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#f0f0e6',
                    font: { size: 10, weight: 'bold' },
                    formatter: (value) => `${value}`
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: 'transparent',
            layout: { padding: { top: 5, right: 5, bottom: 2, left: 5 } },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: { color: '#f0f0e6', font: { size: 9 }, padding: 5 }
                },
                tooltip: { enabled: true },
                datalabels: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    ticks: { color: '#d0d0c8', font: { size: 9 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#d0d0c8', font: { size: 9 } }
                }
            },
            animation: { duration: 500 }
        },
        plugins: [ChartDataLabels]
    });

    // 初始化标签页切换
    initChartTabs();
});