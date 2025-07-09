import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardService } from '../../service/dashboard.service';
import { VentasPorServicio } from '../../model/ventas-por-servicio.model';
import { ServiciosMasVendidosMes } from '../../model/servicios-mas-vendidos-mes.model';
import { MaterialesMasVendidosMes } from '../../model/materiales-mas-vendidos-mes.model';
import { IngresosPorMes } from '../../model/ingresos-por-mes.model';
import { IngresosPorDia } from '../../model/ingresos-por-dia.model';
import { TopClientes } from '../../model/top-clientes.model';
import { PromedioSatisfaccionPorTecnico } from '../../model/promedio-satisfaccion-tecnico.model';
import { take } from 'rxjs';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Datos crudos
  ventasPorServicio: VentasPorServicio[] = [];
  serviciosMasVendidosMes: ServiciosMasVendidosMes[] = [];
  materialesMasVendidosMes: MaterialesMasVendidosMes[] = [];
  ingresosPorMes: IngresosPorMes[] = [];
  ingresosPorDia: IngresosPorDia[] = [];
  topClientes: TopClientes[] = [];
  promedioSatisfaccionPorTecnico: PromedioSatisfaccionPorTecnico[] = [];

  // Estado UI
  loading = true;
  error: string | null = null;
  activeTab = 'ventas-servicio';

  // Chart.js configs (referencias fijas)
  ventasPorServicioChart: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  serviciosMasVendidosMesChart: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  materialesMasVendidosMesChart: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  ingresosPorMesChart: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  ingresosPorDiaChart: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  topClientesChart: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  promedioSatisfaccionPorTecnicoChart: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  // Chart types
  ventasPorServicioType: ChartType = 'bar';
  serviciosMasVendidosMesType: ChartType = 'pie';
  materialesMasVendidosMesType: ChartType = 'bar';
  ingresosPorMesType: ChartType = 'line';
  ingresosPorDiaType: ChartType = 'line';
  topClientesType: ChartType = 'bar';
  promedioSatisfaccionPorTecnicoType: ChartType = 'bar';

  // Opciones comunes para gráficos de barras y líneas
  barLineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (typeof context.parsed.y === 'number') {
              return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
            }
            return context.dataset.label + ': ' + context.parsed.y;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 20,
          minRotation: 0,
          font: { size: 11 }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (typeof value === 'number') {
              return '$' + value.toLocaleString();
            }
            return value;
          }
        }
      }
    }
  };

  // NUEVO: Resúmenes para dashboard de ventas
  ventasResumen: string = '';
  totalVentas: number = 0;
  totalIngresos: number = 0;
  servicioMasVendido: string = '';
  servicioMasVendidoCantidad: number = 0;
  clienteTop: string = '';
  clienteTopMonto: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loading = true;
    // Ventas por servicio
    this.dashboardService.getVentasPorServicio().pipe(take(1)).subscribe({
      next: data => {
        this.ventasPorServicio = data;
        this.ventasPorServicioChart.labels = data.map(v => v.nombreServicio);
        this.ventasPorServicioChart.datasets = [
          { data: data.map(v => v.totalVentas), label: 'Total Ventas', backgroundColor: '#1976d2' }
        ];
        this.totalVentas = data.reduce((acc, v) => acc + (v.totalVentas || 0), 0);
        const topServicio = data.reduce((prev, curr) => (curr.totalVentas > prev.totalVentas ? curr : prev), data[0] || {nombreServicio: '', totalVentas: 0});
        this.servicioMasVendido = topServicio?.nombreServicio || '';
        this.servicioMasVendidoCantidad = topServicio?.totalVentas || 0;
        this.updateVentasResumen();
      },
      error: err => this.error = 'Error al cargar ventas por servicio',
    });
    this.dashboardService.getServiciosMasVendidosMes().pipe(take(1)).subscribe({
      next: data => {
        this.serviciosMasVendidosMes = data;
        this.serviciosMasVendidosMesChart.labels = data.map(s => s.nombreServicio);
        this.serviciosMasVendidosMesChart.datasets = [
          { data: data.map(s => s.cantidadVeces), label: 'Veces Vendido' }
        ];
      },
      error: err => this.error = 'Error al cargar servicios más vendidos',
    });
    this.dashboardService.getMaterialesMasVendidosMes().pipe(take(1)).subscribe({
      next: data => {
        this.materialesMasVendidosMes = data;
        this.materialesMasVendidosMesChart.labels = data.map(m => m.nombreMaterial);
        this.materialesMasVendidosMesChart.datasets = [
          { data: data.map(m => m.cantidadVeces), label: 'Veces Vendido', backgroundColor: '#43a047' }
        ];
      },
      error: err => this.error = 'Error al cargar materiales más vendidos',
    });
    this.dashboardService.getIngresosPorMes().pipe(take(1)).subscribe({
      next: data => {
        this.ingresosPorMes = data;
        this.ingresosPorMesChart.labels = data.map(i => i.mes.substring(0, 7));
        this.ingresosPorMesChart.datasets = [
          { data: data.map(i => i.ingresosTotales), label: 'Ingresos', fill: true, borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.1)' }
        ];
        this.totalIngresos = data.reduce((acc, i) => acc + (i.ingresosTotales || 0), 0);
        this.updateVentasResumen();
      },
      error: err => this.error = 'Error al cargar ingresos por mes',
    });
    this.dashboardService.getIngresosPorDia().pipe(take(1)).subscribe({
      next: data => {
        this.ingresosPorDia = data;
        this.ingresosPorDiaChart.labels = data.map(i => i.fecha);
        this.ingresosPorDiaChart.datasets = [
          { data: data.map(i => i.ingresosDiarios), label: 'Ingresos', fill: true, borderColor: '#ffa000', backgroundColor: 'rgba(255,160,0,0.1)' }
        ];
      },
      error: err => this.error = 'Error al cargar ingresos por día',
    });
    this.dashboardService.getTopClientes().pipe(take(1)).subscribe({
      next: data => {
        this.topClientes = data;
        this.topClientesChart.labels = data.map(c => c.nombreCliente);
        this.topClientesChart.datasets = [
          { data: data.map(c => c.totalGastado), label: 'Total Gastado', backgroundColor: '#8e24aa' }
        ];
        if (data.length > 0) {
          this.clienteTop = data[0].nombreCliente;
          this.clienteTopMonto = data[0].totalGastado;
        }
        this.updateVentasResumen();
      },
      error: err => this.error = 'Error al cargar top clientes',
    });
    this.dashboardService.getPromedioSatisfaccionPorTecnico().pipe(take(1)).subscribe({
      next: data => {
        this.promedioSatisfaccionPorTecnico = data;
        this.promedioSatisfaccionPorTecnicoChart.labels = data.map(p => p.nombreTecnico);
        this.promedioSatisfaccionPorTecnicoChart.datasets = [
          { data: data.map(p => p.promedio), label: 'Promedio', backgroundColor: '#fbc02d' }
        ];
      },
      error: err => this.error = 'Error al cargar satisfacción por técnico',
      complete: () => this.loading = false
    });
  }

  updateVentasResumen() {
    if (this.totalVentas && this.totalIngresos && this.clienteTop && this.servicioMasVendido) {
      this.ventasResumen = `En el periodo analizado se realizaron <b>${this.totalVentas}</b> ventas, generando un ingreso total de <b>$${this.totalIngresos.toLocaleString()}</b>. El servicio más solicitado fue <b>"${this.servicioMasVendido}"</b> con <b>${this.servicioMasVendidoCantidad}</b> ventas. El cliente que más gastó fue <b>${this.clienteTop}</b> con un total de <b>$${this.clienteTopMonto.toLocaleString()}</b>.`;
    }
  }
} 