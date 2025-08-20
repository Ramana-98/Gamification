export interface BankingOffer {
  id: string;
  type: 'rate_reduction' | 'cash_bonus' | 'fee_waiver' | 'service_upgrade';
  title: string;
  description: string;
  value: string;
  code?: string;
  validUntil?: string;
}

export interface ScavengerHuntClue {
  id: string;
  category: 'accounts' | 'loans' | 'credit' | 'services' | 'locations';
  difficulty: 'easy' | 'medium' | 'hard';
  bankingContext: string;
  virtualAction: string;
  physicalAction?: string;
  reward: BankingOffer;
}

export const bankingClues: ScavengerHuntClue[] = [
  {
    id: 'lowest-apr-loan',
    category: 'loans',
    difficulty: 'easy',
    bankingContext: 'Personal loan comparison',
    virtualAction: 'Find and click on the loan with the lowest APR',
    reward: {
      id: 'rate-match',
      type: 'rate_reduction',
      title: 'Rate Match Guarantee',
      description: 'We\'ll match any competitor\'s rate for 30 days',
      value: '0.5% APR reduction',
      validUntil: '2024-12-31'
    }
  },
  {
    id: 'gold-savings-account',
    category: 'accounts',
    difficulty: 'medium',
    bankingContext: 'Premium savings products',
    virtualAction: 'Navigate to the gold-tier savings account page',
    physicalAction: 'Visit a branch to learn about gold account benefits',
    reward: {
      id: 'gold-bonus',
      type: 'cash_bonus',
      title: 'Gold Account Opening Bonus',
      description: 'Get a cash bonus when you open a gold savings account',
      value: '$100 bonus',
      code: 'GOLD100',
      validUntil: '2024-11-30'
    }
  },
  {
    id: 'credit-score-education',
    category: 'credit',
    difficulty: 'easy',
    bankingContext: 'Credit education resources',
    virtualAction: 'Complete the credit score quiz',
    reward: {
      id: 'credit-monitoring',
      type: 'service_upgrade',
      title: 'Free Credit Monitoring',
      description: 'Get 6 months of free credit monitoring service',
      value: '$60 value',
      validUntil: '2024-12-31'
    }
  },
  {
    id: 'mobile-app-features',
    category: 'services',
    difficulty: 'medium',
    bankingContext: 'Digital banking features',
    virtualAction: 'Explore 3 different features in the mobile app',
    reward: {
      id: 'mobile-bonus',
      type: 'fee_waiver',
      title: 'Mobile Banking Bonus',
      description: 'All mobile banking fees waived for 3 months',
      value: 'Free mobile deposits',
      validUntil: '2024-12-31'
    }
  },
  {
    id: 'branch-locator',
    category: 'locations',
    difficulty: 'easy',
    bankingContext: 'Branch network',
    virtualAction: 'Find the nearest branch to your location',
    physicalAction: 'Visit any branch to claim your reward',
    reward: {
      id: 'branch-visit',
      type: 'cash_bonus',
      title: 'Branch Visit Reward',
      description: 'Get a free coffee and $10 account credit for visiting',
      value: '$10 credit + coffee',
      code: 'BRANCH10',
      validUntil: '2024-12-31'
    }
  },
  {
    id: 'investment-options',
    category: 'accounts',
    difficulty: 'hard',
    bankingContext: 'Investment products',
    virtualAction: 'Compare 3 different investment account types',
    reward: {
      id: 'investment-bonus',
      type: 'service_upgrade',
      title: 'Investment Account Bonus',
      description: 'Get $50 bonus and waived fees for 6 months',
      value: '$50 bonus + waived fees',
      code: 'INVEST50',
      validUntil: '2024-11-30'
    }
  },
  {
    id: 'security-features',
    category: 'services',
    difficulty: 'medium',
    bankingContext: 'Account security',
    virtualAction: 'Enable 2-factor authentication on your account',
    reward: {
      id: 'security-bonus',
      type: 'fee_waiver',
      title: 'Security Feature Bonus',
      description: 'Get identity theft protection for free',
      value: '$30 value',
      validUntil: '2024-12-31'
    }
  },
  {
    id: 'loan-calculator',
    category: 'loans',
    difficulty: 'easy',
    bankingContext: 'Loan planning tools',
    virtualAction: 'Use the loan calculator to estimate payments',
    reward: {
      id: 'calculator-bonus',
      type: 'rate_reduction',
      title: 'Loan Application Bonus',
      description: 'Get 0.25% rate reduction on your next loan',
      value: '0.25% APR reduction',
      validUntil: '2024-12-31'
    }
  }
];

export const getRandomClues = (count: number = 5): ScavengerHuntClue[] => {
  const shuffled = [...bankingClues].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getCluesByCategory = (category: string): ScavengerHuntClue[] => {
  return bankingClues.filter(clue => clue.category === category);
};

export const getCluesByDifficulty = (difficulty: string): ScavengerHuntClue[] => {
  return bankingClues.filter(clue => clue.difficulty === difficulty);
}; 