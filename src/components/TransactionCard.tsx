import React from 'react';
import { ResaleTransaction } from '../types.ts';
import { formatPrice, formatMonth } from '../utils/hdb.ts';
import { ChevronRight, Calendar, Layers, Maximize2, Clock } from 'lucide-react';

interface TransactionCardProps {
  transaction: ResaleTransaction;
  onSelect: (transaction: ResaleTransaction) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onSelect,
}) => {
  return (
    <article
      id={`transaction-card-${transaction.id}`}
      onClick={() => onSelect(transaction)}
      className="group bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all duration-150 cursor-pointer active:scale-[0.99] touch-manipulation focus-within:ring-2 focus-within:ring-stone-900"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(transaction);
        }
      }}
      aria-label={`View transaction details for ${transaction.flat_type} at ${transaction.block} ${transaction.street_name}, ${transaction.town} sold for ${formatPrice(transaction.resale_price_num)}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {/* Town and street name */}
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-stone-600">
              {transaction.town}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-semibold text-stone-700">
              Blk {transaction.block}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-stone-950 group-hover:text-stone-900 leading-snug">
            {transaction.street_name}
          </h3>
        </div>

        {/* Resale Price */}
        <div className="text-right shrink-0">
          <span className="text-xs font-semibold text-stone-600 block">
            Sold for
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
            {formatPrice(transaction.resale_price_num)}
          </span>
        </div>
      </div>

      {/* Metadata Badges / Info */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-stone-700">
        {/* Flat Type */}
        <div className="inline-flex items-center gap-1.5 font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md">
          <span>{transaction.flat_type}</span>
          <span className="text-stone-400 font-normal">({transaction.flat_model})</span>
        </div>

        {/* Month of Sale */}
        <div className="inline-flex items-center gap-1 text-stone-600">
          <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>{formatMonth(transaction.month)}</span>
        </div>

        {/* Storey Range */}
        <div className="inline-flex items-center gap-1 text-stone-600">
          <Layers className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>Storey {transaction.storey_range}</span>
        </div>

        {/* Floor Area in sqm */}
        <div className="inline-flex items-center gap-1 text-stone-600">
          <Maximize2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>{transaction.floor_area_sqm} sqm</span>
        </div>

        {/* Remaining Lease */}
        <div className="inline-flex items-center gap-1 text-stone-600 sm:ml-auto">
          <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>{transaction.remaining_lease}</span>
        </div>

        {/* Chevron for mobile tap affordance */}
        <div className="ml-auto hidden sm:flex items-center text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </article>
  );
};
