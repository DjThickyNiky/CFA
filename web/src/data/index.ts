import { ethics } from './ethics';
import { quantitativeMethods } from './quantitativeMethods';
import { economics } from './economics';
import { financialReporting } from './financialReporting';
import { corporateIssuers } from './corporateIssuers';
import { equityInvestments } from './equityInvestments';
import { fixedIncome } from './fixedIncome';
import { derivatives } from './derivatives';
import { alternativeInvestments } from './alternativeInvestments';
import { portfolioManagement } from './portfolioManagement';
import type { TopicModule } from './types';

export const topics: TopicModule[] = [
  ethics,
  quantitativeMethods,
  economics,
  financialReporting,
  corporateIssuers,
  equityInvestments,
  fixedIncome,
  derivatives,
  alternativeInvestments,
  portfolioManagement,
];
