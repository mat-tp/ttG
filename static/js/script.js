// static/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 50);
    loadVisitors();
    
    document.getElementById('visitorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addVisitor();
    });
});

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Update analog clock hands
    const hourDeg = (hours % 12 + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;
    const secondDeg = (seconds + milliseconds / 1000) * 6;

    document.querySelector('.hour-hand').style.transform = `rotate(${hourDeg}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minuteDeg}deg)`;
    document.querySelector('.second-hand').style.transform = `rotate(${secondDeg}deg)`;

    // Update digital time
    document.querySelector('.digital-time').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function loadVisitors() {
    try {
        const response = await fetch('/api/visitors');
        const visitors = await response.json();
        displayVisitors(visitors);
    } catch (error) {
        console.error('Error loading visitors:', error);
    }
}

function displayVisitors(visitors) {
    const visitorList = document.getElementById('visitorList');
    visitorList.innerHTML = visitors.map(visitor => `
        <div class="visitor-card">
            <h3>${visitor.name}</h3>
            <div class="visitor-info">
                <span>${new Date(visitor.timestamp).toLocaleString()}</span>
                <span class="visitor-rank">${visitor.rank}</span>
            </div>
        </div>
    `).join('');
}

async function addVisitor() {
    const nameInput = document.getElementById('visitorName');
    const name = nameInput.value.trim();
    
    if (!name) return;

    try {
        const response = await fetch('/api/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        if (response.ok) {
            nameInput.value = '';
            loadVisitors();
        }
    } catch (error) {
        console.error('Error adding visitor:', error);
    }
}