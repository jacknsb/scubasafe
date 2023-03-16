document.getElementById('dive-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const depth = parseInt(document.getElementById('depth').value, 10);
    const time = parseInt(document.getElementById('time').value, 10);
    const result = calculateScubaDiveTable(depth, time);
    
    if (result) {
        document.getElementById('pressure-group').textContent = 'Pressure Group: ' + result
