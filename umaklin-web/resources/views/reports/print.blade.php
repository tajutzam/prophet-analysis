<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BUKU BESAR LAPORAN KEUANGAN - UMAKLIN ({{ $filters['start_date'] }} s/d {{ $filters['end_date'] }})</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }
        body {
            font-family: 'Courier New', Courier, monospace;
            color: #000;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            background: white;
            font-size: 10px;
        }
        .header-ledger {
            text-align: center;
            border-bottom: 2px double #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header-ledger h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 5px;
            font-weight: bold;
        }
        .header-ledger p {
            margin: 5px 0;
            font-size: 12px;
            font-weight: bold;
        }
        .summary-box {
            display: flex;
            justify-content: space-around;
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 20px;
            background: #f0f0f0;
        }
        .summary-item { text-align: center; }
        .summary-label { font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 3px; }

        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
        }
        th {
            border: 1px solid #000;
            padding: 8px 4px;
            background: #e0e0e0;
            text-transform: uppercase;
            font-weight: bold;
        }
        td {
            border: 1px solid #000;
            padding: 6px 4px;
            vertical-align: top;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .zebra-row { background: #fafafa; }
        
        .footer-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }
        .ttd-container {
            display: flex;
            justify-content: flex-end;
            gap: 100px;
            margin-top: 20px;
        }
        .ttd-box {
            text-align: center;
            width: 200px;
        }
        .ttd-space { height: 60px; }
        
        .page-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 8px;
            text-align: right;
            border-top: 1px solid #000;
            padding-top: 2px;
        }
    </style>
</head>
<body onload="window.print()">
    <div class="header-ledger">
        <h1>UMAKLIN LAUNDRY SYSTEM</h1>
        <p>BUKU BESAR RINCIAN TRANSAKSI (GENERAL LEDGER)</p>
        <p>PERIODE: {{ \Carbon\Carbon::parse($filters['start_date'])->format('d/m/Y') }} S/D {{ \Carbon\Carbon::parse($filters['end_date'])->format('d/m/Y') }}</p>
    </div>

    <div class="summary-box">
        <div class="summary-item">
            <div class="summary-label">TOTAL PENDAPATAN</div>
            <div class="stat-value">IDR {{ number_format($stats['total_revenue'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">VOL. BERAT (KG)</div>
            <div class="stat-value">{{ number_format($stats['total_weight'], 1) }} KG</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">JUMLAH TRX</div>
            <div class="stat-value">{{ $stats['total_transactions'] }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="30">NO</th>
                <th width="80">TANGGAL</th>
                <th width="120">NO. RESI</th>
                <th width="150">PELANGGAN</th>
                <th>RINCIAN LAYANAN</th>
                <th width="60">BERAT</th>
                <th width="100">TOTAL HARGA</th>
                <th width="70">STATUS</th>
            </tr>
        </thead>
        <tbody>
            @php $totalPrice = 0; $totalWeight = 0; @endphp
            @foreach($transactions as $index => $transaction)
            <tr class="{{ $index % 2 == 0 ? '' : 'zebra-row' }}">
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="text-center">{{ \Carbon\Carbon::parse($transaction->date)->format('d/m/y') }}</td>
                <td class="text-center font-bold">{{ $transaction->receipt_number }}</td>
                <td>{{ $transaction->user->name ?? 'Guest' }}</td>
                <td>
                    @foreach($transaction->items as $item)
                        • {{ $item->service->name ?? 'Service' }} ({{ $item->weight }}Kg)<br>
                    @endforeach
                </td>
                <td class="text-center">{{ number_format($transaction->total_weight, 1) }} Kg</td>
                <td class="text-right font-bold">{{ number_format($transaction->total_price, 0, ',', '.') }}</td>
                <td class="text-center" style="font-size: 8px;">{{ strtoupper($transaction->payment_status) }}</td>
            </tr>
            @php 
                $totalPrice += $transaction->total_price; 
                $totalWeight += $transaction->total_weight;
            @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background: #e0e0e0; font-weight: bold;">
                <td colspan="5" class="text-right">GRAND TOTAL PERIODE INI :</td>
                <td class="text-center">{{ number_format($totalWeight, 1) }} Kg</td>
                <td class="text-right">IDR {{ number_format($totalPrice, 0, ',', '.') }}</td>
                <td></td>
            </tr>
        </tfoot>
    </table>

    <div class="footer-section">
        <p><i>* Laporan ini dihasilkan secara otomatis oleh Umaklin AI Engine pada {{ now()->format('d/m/Y H:i:s') }}</i></p>
        
        <div class="ttd-container">
            <div class="ttd-box">
                <p>Dilaporkan Oleh,</p>
                <div class="ttd-space"></div>
                <p><b>{{ auth()->user()->name }}</b></p>
                <p>Staf Operasional</p>
            </div>
            <div class="ttd-box">
                <p>Diketahui Oleh,</p>
                <div class="ttd-space"></div>
                <p><b>( ............................ )</b></p>
                <p>Manager / Owner</p>
            </div>
        </div>
    </div>

    <div class="page-footer">
        Halaman 1 dari 1 - Dokumen Rahasia Perusahaan Umaklin
    </div>
</body>
</html>
