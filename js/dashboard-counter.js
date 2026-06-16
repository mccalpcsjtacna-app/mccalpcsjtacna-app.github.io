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
        var callbackName = '_gviz_cb_' + Math.floor(Math.random() * 100000);
        window[callbackName] = function(response) {
            if (response.status === 'ok' && response.table) {
                var rows = response.table.rows;
                var sums = {};
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.c && row.c[0] && row.c[0].v !== null) {
                        sums[row.c[0].v] = row.c[1].v;
                    }
                }
                updateCounters(sums);
            }
            delete window[callbackName];
        };
        var script = document.createElement('script');
        script.src = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=responseHandler:' + callbackName + '&sheet=' + SHEET_NAME + '&tq=' + encodeURIComponent('SELECT A, SUM(P) GROUP BY A LIMIT 200');
        document.head.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCounters);
    } else {
        loadCounters();
    }
})();
