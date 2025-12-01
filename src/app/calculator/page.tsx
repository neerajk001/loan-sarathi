'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calculator as CalculatorIcon, TrendingUp, Wallet, Calendar, Percent, IndianRupee, ArrowRight, Sparkles, PiggyBank, Target, Clock, RefreshCw, Percent as PercentIcon, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const DetailedCalculatorContent = () => {
  const searchParams = useSearchParams();
  // Determine initial tab
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    if (tab === 'balance' || tab === 'part-payment') return tab;
    return 'emi';
  };
  
  const [activeTab, setActiveTab] = useState<'emi' | 'balance' | 'part-payment'>(getInitialTab());

  // Update activeTab if searchParams change
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'balance' || tab === 'part-payment' || tab === 'emi') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

  // Balance Transfer State
  const [btIncome, setBtIncome] = useState(100000);
  const [outstanding, setOutstanding] = useState(1000000);
  const [btExistingEmi, setBtExistingEmi] = useState(15000);
  const [btTenure, setBtTenure] = useState(7);
  
  // BT Results
  const [btMaxEmi, setBtMaxEmi] = useState(0);
  const [btPerLakhEmi, setBtPerLakhEmi] = useState(0);
  const [btMaxLoan, setBtMaxLoan] = useState(0);
  const [btNetInHand, setBtNetInHand] = useState(0);

  // Part Payment State
  const [ppLoanAmount, setPpLoanAmount] = useState(409375);
  const [ppInterestRate, setPpInterestRate] = useState(10.5);
  const [ppTenure, setPpTenure] = useState(12); // in years
  const [ppReductionType, setPpReductionType] = useState<'emi' | 'tenure'>('emi');
  const [partPayments, setPartPayments] = useState<{ amount: number; month: number }[]>([
    { amount: 100000, month: 2 },
    { amount: 100000, month: 4 },
    { amount: 100000, month: 8 },
  ]);

  // Part Payment Results
  const [ppResults, setPpResults] = useState({
    originalInterest: 0,
    newInterest: 0,
    savings: 0,
    newTenureYears: 0,
    newTenureMonths: 0,
    schedule: [] as any[]
  });

  // EMI Calculation
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure, tenureType]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = tenureType === 'years' ? tenure * 12 : tenure;

    let monthlyEmi = 0;
    let totalInt = 0;

    if (ratePerMonth === 0) {
      monthlyEmi = principal / numberOfMonths;
      totalInt = 0;
    } else {
      monthlyEmi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                   (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);
    }

    const totalPay = monthlyEmi * numberOfMonths;
    totalInt = totalPay - principal;

    setEmi(Math.round(monthlyEmi));
    setTotalInterest(Math.round(totalInt));
    setTotalPayment(Math.round(totalPay));

    setChartData([
      { name: 'Principal', value: principal },
      { name: 'Interest', value: Math.round(totalInt) },
    ]);

    // Generate Amortization Schedule
    let balance = principal;
    const yearlySchedule = [];
    let currentYearInterest = 0;
    let currentYearPrincipal = 0;
    
    for (let i = 1; i <= numberOfMonths; i++) {
      const interestForMonth = balance * ratePerMonth;
      const principalForMonth = monthlyEmi - interestForMonth;
      balance -= principalForMonth;

      currentYearInterest += interestForMonth;
      currentYearPrincipal += principalForMonth;

      if (i % 12 === 0 || i === numberOfMonths) {
        yearlySchedule.push({
          year: Math.ceil(i / 12),
          principal: Math.round(currentYearPrincipal),
          interest: Math.round(currentYearInterest),
          balance: Math.max(0, Math.round(balance)),
        });
        currentYearInterest = 0;
        currentYearPrincipal = 0;
      }
    }
    setAmortizationSchedule(yearlySchedule);
  };

  // Balance Transfer Calculation
  useEffect(() => {
    // Constants
    const BT_RATE = 10.5;
    const FOIR = 0.70; // 70% based on user requirement

    // 1. Calculate Max EMI Capacity
    const maxCapacity = (btIncome * FOIR) - btExistingEmi;
    setBtMaxEmi(Math.max(0, Math.round(maxCapacity)));

    // 2. Calculate Per Lakh EMI
    // EMI for 1,00,000 at 10.5% for btTenure years
    const r = BT_RATE / 12 / 100;
    const n = btTenure * 12;
    
    let perLakh = 0;
    if (r > 0 && n > 0) {
      perLakh = 100000 * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    }
    setBtPerLakhEmi(Math.round(perLakh));

    // 3. Calculate Max Loan Amount
    // Derived from Max EMI Capacity using the same rate and tenure
    let maxLoan = 0;
    if (maxCapacity > 0 && r > 0 && n > 0) {
      maxLoan = maxCapacity * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    }
    setBtMaxLoan(Math.round(maxLoan));

    // 4. Net In Hand
    const net = Math.max(0, maxLoan - outstanding);
    setBtNetInHand(Math.round(net));

  }, [btIncome, outstanding, btExistingEmi, btTenure]);

  // Part Payment Calculation
  const calculatePartPayment = () => {
    const ratePerMonth = ppInterestRate / 12 / 100;
    const totalMonths = ppTenure * 12;
    
    // Calculate Base EMI (Original)
    let baseEmi = 0;
    if (ratePerMonth > 0) {
      baseEmi = (ppLoanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, totalMonths)) / 
                (Math.pow(1 + ratePerMonth, totalMonths) - 1);
    }

    // Original Interest
    const totalOriginalPayment = baseEmi * totalMonths;
    const originalInterest = totalOriginalPayment - ppLoanAmount;

    // Simulation
    let balance = ppLoanAmount;
    let totalInterestPaid = 0;
    let currentEmi = baseEmi;
    const schedule = [];
    let monthsPassed = 0;

    for (let m = 1; m <= totalMonths; m++) {
      // Check for Part Payment
      const pp = partPayments.find(p => p.month === m)?.amount || 0;
      
      const interestForMonth = balance * ratePerMonth;
      const principalForMonth = currentEmi - interestForMonth;
      
      let closingBalance = balance - principalForMonth - pp;
      
      if (closingBalance < 0) closingBalance = 0;

      totalInterestPaid += interestForMonth;
      monthsPassed = m;

      schedule.push({
        month: m,
        partPayment: pp,
        balance: Math.round(closingBalance),
        emi: Math.round(currentEmi)
      });

      balance = closingBalance;

      if (balance <= 0) break;

      // Recalculate if Reduce EMI
      if (ppReductionType === 'emi' && pp > 0) {
        const remainingMonths = totalMonths - m;
        if (remainingMonths > 0) {
           currentEmi = (balance * ratePerMonth * Math.pow(1 + ratePerMonth, remainingMonths)) / 
                        (Math.pow(1 + ratePerMonth, remainingMonths) - 1);
        }
      }
    }

    const savings = originalInterest - totalInterestPaid;
    const newTenureYears = Math.floor(monthsPassed / 12);
    const newTenureMonths = monthsPassed % 12;

    setPpResults({
      originalInterest: Math.round(originalInterest),
      newInterest: Math.round(totalInterestPaid),
      savings: Math.round(savings),
      newTenureYears,
      newTenureMonths,
      schedule
    });
  };

  useEffect(() => {
    calculatePartPayment();
  }, [ppLoanAmount, ppInterestRate, ppTenure, ppReductionType, partPayments]);

  const addPartPaymentRow = () => {
    setPartPayments([...partPayments, { amount: 0, month: 0 }]);
  };

  const updatePartPayment = (index: number, field: 'amount' | 'month', value: number) => {
    const newPayments = [...partPayments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setPartPayments(newPayments);
  };

  const removePartPayment = (index: number) => {
    const newPayments = partPayments.filter((_, i) => i !== index);
    setPartPayments(newPayments);
  };

  const COLORS = ['#3b82f6', '#f59e0b'];

  const interestPercentage = totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0;
  const principalPercentage = 100 - interestPercentage;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <CalculatorIcon className="w-4 h-4" />
            FINANCIAL TOOLS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {activeTab === 'emi' && 'EMI Calculator'}
            {activeTab === 'balance' && 'Balance Transfer Calculator'}
            {activeTab === 'part-payment' && 'Part Payment Calculator'}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {activeTab === 'emi' && 'Plan your loan with precise calculations and detailed payment breakdown'}
            {activeTab === 'balance' && 'Calculate your eligibility and savings for balance transfer'}
            {activeTab === 'part-payment' && 'See how much you can save by making part payments'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('emi')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'emi'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <CalculatorIcon className="w-4 h-4" />
              EMI Calculator
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'balance'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Balance Transfer
            </button>
            <button
              onClick={() => setActiveTab('part-payment')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'part-payment'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <PercentIcon className="w-4 h-4" />
              Part Payment
            </button>
          </div>
        </div>

        {/* EMI Calculator View */}
        {activeTab === 'emi' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            
            {/* Main Calculator Input - Large Card */}
            <div className="col-span-12 lg:col-span-7 bg-white border border-gray-900 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <CalculatorIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Loan Details</h2>
                  <p className="text-gray-500 text-sm">Adjust the values to calculate EMI</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Loan Amount */}
                <SliderInput label="Loan Amount" value={loanAmount} setValue={setLoanAmount} min={100000} max={10000000} step={10000} prefix="₹" />
                {/* Interest Rate */}
                <SliderInput label="Interest Rate (p.a.)" value={interestRate} setValue={setInterestRate} min={5} max={20} step={0.1} suffix="%" />
                {/* Tenure */}
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Loan Tenure
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex bg-gray-100 rounded-xl p-1">
                        <button 
                          onClick={() => setTenureType('years')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tenureType === 'years' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                        >
                          Years
                        </button>
                        <button 
                          onClick={() => setTenureType('months')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tenureType === 'months' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                        >
                          Months
                        </button>
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 w-20 text-center">
                        <input 
                          type="number" 
                          value={tenure}
                          onChange={(e) => setTenure(Number(e.target.value))}
                          className="bg-transparent text-center w-full focus:outline-none font-bold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max={tenureType === 'years' ? 30 : 360} 
                    step="1" 
                    value={tenure} 
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>1 {tenureType === 'years' ? 'Year' : 'Month'}</span>
                    <span>{tenureType === 'years' ? '30 Years' : '360 Months'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EMI Result - Featured Card */}
            <div className="col-span-12 lg:col-span-5 bg-gray-900 border border-gray-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
                  <Sparkles className="w-4 h-4" />
                  MONTHLY EMI
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-6">
                  ₹{formatCurrency(emi)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="text-gray-400 text-xs font-medium mb-1">Total Interest</div>
                    <div className="text-xl font-bold">₹{formatCurrency(totalInterest)}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="text-gray-400 text-xs font-medium mb-1">Total Payment</div>
                    <div className="text-xl font-bold">₹{formatCurrency(totalPayment)}</div>
                  </div>
                </div>

                <Link 
                  href="/apply"
                  className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Apply for this Loan
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Donut Chart Card */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-gray-900 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Payment Breakdown</h3>
              
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold text-gray-900">{principalPercentage}%</div>
                  <div className="text-xs text-gray-500">Principal</div>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Principal ({principalPercentage}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-600">Interest ({interestPercentage}%)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white border border-gray-900 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <PiggyBank className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{formatCurrency(loanAmount)}</div>
                <div className="text-sm text-gray-500">Principal</div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white border border-gray-900 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{interestRate}%</div>
                <div className="text-sm text-gray-500">Interest Rate</div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-6 lg:col-span-2 bg-white border border-gray-900 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tenure} {tenureType === 'years' ? 'Yrs' : 'Mo'}</div>
                <div className="text-sm text-gray-500">Tenure</div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-6 lg:col-span-2 bg-white border border-gray-900 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{formatCurrency(totalInterest)}</div>
                <div className="text-sm text-gray-500">Total Interest</div>
              </div>
            </div>

            {/* Eligibility Check CTA */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gray-900 border border-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Check Eligibility</h3>
                <p className="text-gray-400 text-sm mb-4">Find out how much loan you can get based on your income</p>
                <Link 
                  href="/check-eligibility"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-gray-300 transition-colors"
                >
                  Check Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="col-span-12 bg-white border border-gray-900 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Repayment Schedule</h3>
                  <p className="text-gray-500 text-sm">Year-wise breakdown of your loan payments</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-4 px-4 text-gray-500 font-semibold text-sm">Year</th>
                      <th className="text-right py-4 px-4 text-gray-500 font-semibold text-sm">Principal Paid</th>
                      <th className="text-right py-4 px-4 text-gray-500 font-semibold text-sm">Interest Paid</th>
                      <th className="text-right py-4 px-4 text-gray-500 font-semibold text-sm">Outstanding Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 text-sm">
                            {row.year}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4 font-medium text-gray-900">₹{formatCurrency(row.principal)}</td>
                        <td className="text-right py-4 px-4 font-medium text-amber-600">₹{formatCurrency(row.interest)}</td>
                        <td className="text-right py-4 px-4 font-bold text-blue-600">₹{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {amortizationSchedule.length > 5 && (
                <div className="text-center mt-6">
                  <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                    View Full Schedule ({amortizationSchedule.length} years)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Balance Transfer View */}
        {activeTab === 'balance' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* BT Inputs Card */}
            <div className="col-span-12 lg:col-span-6 bg-white border border-gray-900 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Balance Transfer Details</h2>
                  <p className="text-gray-500 text-sm">Enter details to check your benefits</p>
                </div>
              </div>

              <div className="space-y-8">
                <SliderInput label="Monthly Income" value={btIncome} setValue={setBtIncome} min={20000} max={500000} step={1000} prefix="₹" />
                <SliderInput label="BT Loan Amount Outstanding" value={outstanding} setValue={setOutstanding} min={100000} max={5000000} step={10000} prefix="₹" />
                <SliderInput label="Existing EMI" value={btExistingEmi} setValue={setBtExistingEmi} min={0} max={200000} step={500} prefix="₹" />
                <SliderInput label="Desired Tenure (Years)" value={btTenure} setValue={setBtTenure} min={1} max={30} step={1} suffix=" Years" />
              </div>
            </div>

            {/* BT Results Grid */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              
              {/* Top Summary Card */}
              <div className="bg-gray-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <div className="relative">
                   <div className="text-gray-400 text-sm font-bold mb-2">NET IN HAND</div>
                   <div className="text-4xl font-bold mb-1">₹{formatCurrency(btNetInHand)}</div>
                   <p className="text-gray-400 text-sm">Amount available after Balance Transfer</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                 {/* Max EMI Capacity */}
                 <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                   <div className="text-sm text-gray-500 font-medium mb-2">Max EMI Capacity</div>
                   <div className="text-2xl font-bold text-gray-900 mb-1">₹{formatCurrency(btMaxEmi)}</div>
                   <div className="text-xs text-blue-600 font-medium">New EMI Amount</div>
                 </div>

                 {/* Per Lakh EMI */}
                 <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                   <div className="text-sm text-gray-500 font-medium mb-2">Per Lakh EMI</div>
                   <div className="text-2xl font-bold text-gray-900 mb-1">₹{formatCurrency(btPerLakhEmi)}</div>
                   <div className="text-xs text-blue-600 font-medium">@ 10.50% for {btTenure} Years</div>
                 </div>

                 {/* Max Loan Amount */}
                 <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-2">
                   <div className="flex justify-between items-end">
                     <div>
                       <div className="text-sm text-gray-500 font-medium mb-2">Max Loan Eligibility</div>
                       <div className="text-3xl font-bold text-gray-900">₹{formatCurrency(btMaxLoan)}</div>
                       <div className="text-xs text-blue-600 font-medium mt-1">Total eligible amount based on your income</div>
                     </div>
                     <Link href="/apply" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                        <ArrowRight className="w-6 h-6" />
                     </Link>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Part Payment Calculator View */}
        {activeTab === 'part-payment' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            
            {/* Inputs Column */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
               <div className="bg-white border border-gray-900 rounded-3xl p-6 md:p-8 shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                     <PercentIcon className="w-6 h-6 text-blue-600" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-gray-900">Loan Details</h2>
                     <p className="text-gray-500 text-sm">Input your current loan status</p>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <SliderInput label="Loan Amount (₹)" value={ppLoanAmount} setValue={setPpLoanAmount} min={100000} max={10000000} step={10000} prefix="₹" />
                   <SliderInput label="Interest Rate (%)" value={ppInterestRate} setValue={setPpInterestRate} min={8} max={21} step={0.1} suffix="%" />
                   <SliderInput label="Outstanding Tenure (Years)" value={ppTenure} setValue={setPpTenure} min={1} max={30} step={1} suffix=" Years" />
                 </div>
               </div>

               {/* Part Payments Inputs */}
               <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Part Payments</h3>
                    <button 
                      onClick={addPartPaymentRow}
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" /> Add Payment
                    </button>
                 </div>

                 <div className="space-y-4">
                   {partPayments.map((payment, index) => (
                     <div key={index} className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-gray-50 p-4 rounded-xl">
                       <div className="flex-1 w-full">
                         <label className="block text-xs font-semibold text-gray-500 mb-1">Part Payment {index + 1} (₹)</label>
                         <input 
                           type="number" 
                           value={payment.amount}
                           onChange={(e) => updatePartPayment(index, 'amount', Number(e.target.value))}
                           className="w-full p-2 rounded-lg border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                         />
                       </div>
                       <div className="flex-1 w-full">
                         <label className="block text-xs font-semibold text-gray-500 mb-1">at Month</label>
                         <input 
                           type="number" 
                           value={payment.month}
                           onChange={(e) => updatePartPayment(index, 'month', Number(e.target.value))}
                           className="w-full p-2 rounded-lg border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                         />
                       </div>
                       {partPayments.length > 1 && (
                         <button 
                           onClick={() => removePartPayment(index)}
                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                     </div>
                   ))}
                 </div>

                 <button 
                   onClick={calculatePartPayment}
                   className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                 >
                   Calculate Savings
                 </button>
               </div>
            </div>

            {/* Results Column */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              {/* Summary Card */}
              <div className="bg-blue-900 text-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                     <div>
                       <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total Interest With Prepayment</div>
                       <div className="text-xl font-bold">₹{formatCurrency(ppResults.newInterest)}</div>
                     </div>
                     <div>
                       <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Interest Without Prepayment</div>
                       <div className="text-xl font-bold">₹{formatCurrency(ppResults.originalInterest)}</div>
                     </div>
                   </div>

                   <div className="bg-amber-100 text-amber-900 p-6 rounded-2xl text-center">
                     <div className="text-sm font-medium mb-1">Your savings on interest is</div>
                     <div className="text-3xl font-bold">₹{formatCurrency(ppResults.savings)}</div>
                   </div>

                   <Link href="/apply" className="block w-full bg-blue-600 text-white text-center font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors">
                     Apply For Loan
                   </Link>
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            {ppResults.schedule.length > 0 && (
              <div className="col-span-12 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
                <h3 className="font-bold text-gray-900 mb-6">Amortization Schedule with Part Payments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="py-3 px-4 text-left rounded-tl-lg">Month</th>
                        <th className="py-3 px-4 text-right">Part Payment (₹)</th>
                        <th className="py-3 px-4 text-right">Remaining Balance (₹)</th>
                        <th className="py-3 px-4 text-right rounded-tr-lg">EMI (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ppResults.schedule.slice(0, 12).map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{row.month}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-700">{row.partPayment > 0 ? formatCurrency(row.partPayment) : '0'}</td>
                          <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(row.balance)}</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">{formatCurrency(row.emi)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ppResults.schedule.length > 12 && (
                    <div className="text-center mt-4 text-gray-500 text-xs">
                      Showing first 12 months only...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
};

// Helper Component
const SliderInput = ({ label, value, setValue, min, max, step, prefix = '', suffix = '' }: any) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        {label}
      </label>
      <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-1">
        {prefix && <span className="font-bold text-gray-900">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="bg-transparent font-bold text-gray-900 w-24 text-right outline-none appearance-none"
        />
        {suffix && <span className="font-bold text-gray-900">{suffix}</span>}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

export default function DetailedCalculator() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <DetailedCalculatorContent />
    </Suspense>
  );
}
