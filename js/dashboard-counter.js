(function() {
    var SHEET_ID = '1jnB9tY9RPNR9UTjQ7e-s2AUnzR1y3zmHqPs1idRjtV8';
    var SHEET_NAME = 'carga';

    var COUNTERS = [
        { id: 'counter-demandas',  varIds: [49, 85] },
        { id: 'counter-sentencias', varIds: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 89] },
        { id: 'counter-ejecutadas', varIds: [17] }
    ];

    function animateCounter(el, target) {
        var duration = 1500;
        var startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    function updateCounters(sums) {
        for (var c = 0; c < COUNTERS.length; c++) {
            var counter = COUNTERS[c];
            var total = 0;
            for (var v = 0; v < counter.varIds.length; v++) {
                var s = sums[counter.varIds[v]];
                if (s) total += s;
            }
            var el = document.getElementById(counter.id);
            if (el) animateCounter(el, total);
        }
    }

    function loadCounters() {
        var script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = function() {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(function() {
                var query = new google.visualization.Query(
                    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_NAME
                );
                query.setQuery('SELECT A, SUM(P) GROUP BY A');
                query.send(function(response) {
                    if (response.isError()) return;
                    var dt = response.getDataTable();
                    var sums = {};
                    for (var row = 0; row < dt.getNumberOfRows(); row++) {
                        sums[dt.getValue(row, 0)] = dt.getValue(row, 1);
                    }
                    updateCounters(sums);
                });
            });
        };
        document.head.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCounters);
    } else {
        loadCounters();
    }
})();
