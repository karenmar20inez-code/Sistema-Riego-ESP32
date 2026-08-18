let graficos = {};

function inicializarGraficos() {
    const ctxTempHumedad = document.getElementById('tempHumidityChart');
    if (ctxTempHumedad) {
        // Line chart displayed as points (lineal de puntos)
        graficos.tempHumedad = new Chart(ctxTempHumedad, {
            type: 'line',
            data: {
                labels: datosRiego.datosHistoricos.etiquetas,
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: datosRiego.datosHistoricos.temperaturas,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239,68,68,0.12)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0,
                        showLine: false, // hide connecting line to show points only
                        pointRadius: 6,
                        pointStyle: 'circle',
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#111827',
                        pointBorderWidth: 2,
                    },
                    {
                        label: 'Humedad del Suelo (%)',
                        data: datosRiego.datosHistoricos.humedad,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.12)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0,
                        showLine: false,
                        pointRadius: 6,
                        pointStyle: 'rect',
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#111827',
                        pointBorderWidth: 2,
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            font: { size: 12, weight: 'bold' },
                            padding: 20,
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(59, 130, 246, 0.06)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    }
                }
            }
        });
    }

    const ctxFrequency = document.getElementById('frequencyChart');
    if (ctxFrequency) {
        // Bar chart with distinct color palette
        graficos.frequency = new Chart(ctxFrequency, {
            type: 'bar',
            data: {
                labels: ['08:00', '10:30', '13:00', '15:30', '18:00'],
                datasets: [{
                    label: 'Agua (L)',
                    data: [2.4, 2.1, 2.3, 2.0, 2.5],
                    backgroundColor: ['#06b6d4','#0ea5e9','#3b82f6','#6366f1','#8b5cf6'],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            font: { size: 12, weight: 'bold' },
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(59, 130, 246, 0.06)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    }
                }
            }
        });
    }

    const ctxNutrienteDist = document.getElementById('nutrientDistributionChart');
    if (ctxNutrienteDist) {
        // Hacerla igual que "Consumo de Nutrientes por Planta" — gráfico tipo pastel (pie)
        const datosNutriente = datosRiego.obtenerDistribucionNutrientes();
        graficos.nutrienteDist = new Chart(ctxNutrienteDist, {
            type: 'pie',
            data: {
                labels: datosNutriente.etiquetas,
                datasets: [{
                    data: datosNutriente.datos,
                    backgroundColor: datosNutriente.colores,
                    borderColor: '#1e293b',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#d1d5db',
                            font: { size: 11 },
                            padding: 12,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = Number(context.parsed || context.raw || 0);
                                const dataArr = context.chart.data.datasets[0].data;
                                const total = dataArr.reduce((s, v) => s + Number(v || 0), 0);
                                const pct = total ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${label}: ${value} (${pct}%)`;
                            }
                        }
                    }
                },
                layout: {
                    padding: { top: 8, bottom: 8 }
                }
            }
        });
    }

    const ctxNutrientePlanta = document.getElementById('nutrientByPlantChart');
    if (ctxNutrientePlanta) {
        const datosNutrientePlanta = datosRiego.obtenerNutrientesPorPlanta();
        graficos.nutrientePlanta = new Chart(ctxNutrientePlanta, {
            type: 'doughnut',
            data: {
                labels: datosNutrientePlanta.etiquetas,
                datasets: [{
                    data: datosNutrientePlanta.datos,
                    backgroundColor: datosNutrientePlanta.colores,
                    borderColor: '#1e293b',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#d1d5db',
                            font: { size: 11 },
                            padding: 15,
                        }
                    }
                }
            }
        });
    }

    const ctxEventosRiego = document.getElementById('irrigationEventsChart');
    if (ctxEventosRiego) {
        const eventosRiego = datosRiego.obtenerEventosRiego();
        graficos.eventosRiego = new Chart(ctxEventosRiego, {
            type: 'bar',
            data: {
                labels: eventosRiego.etiquetas,
                datasets: [{
                    label: 'Eventos',
                    data: eventosRiego.datos,
                    backgroundColor: [
                        '#06b6d4',
                        '#0ea5e9',
                        '#3b82f6',
                        '#6366f1',
                        '#8b5cf6',
                        '#a855f7',
                        '#d946ef',
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7,
                        grid: {
                            color: 'rgba(59, 130, 246, 0.1)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    }
                }
            }
        });
    }

    const ctxTempSemanal = document.getElementById('weeklyTempChart');
    if (ctxTempSemanal) {
        const tempSemanal = datosRiego.obtenerTemperaturaSemanal();
        graficos.tempSemanal = new Chart(ctxTempSemanal, {
            type: 'line',
            data: {
                labels: tempSemanal.etiquetas,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: tempSemanal.datos,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#f97316',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            font: { size: 12, weight: 'bold' },
                            padding: 20,
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 30,
                        grid: {
                            color: 'rgba(59, 130, 246, 0.1)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    }
                }
            }
        });
    }

    const ctxHumedadSemanal = document.getElementById('weeklyHumidityChart');
    if (ctxHumedadSemanal) {
        const humedadSemanal = datosRiego.obtenerHumedadSemanal();
        graficos.humedadSemanal = new Chart(ctxHumedadSemanal, {
            type: 'line',
            data: {
                labels: humedadSemanal.etiquetas,
                datasets: [{
                    label: 'Humedad (%)',
                    data: humedadSemanal.datos,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#06b6d4',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            font: { size: 12, weight: 'bold' },
                            padding: 20,
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(59, 130, 246, 0.1)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#9ca3af',
                        }
                    }
                }
            }
        });
    }

    // Exponer referencia global para facilitar actualizaciones desde otros módulos
    try { window.graficos = graficos; } catch (e) { /* ignore */ }
}