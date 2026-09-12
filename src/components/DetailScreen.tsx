import React from 'react';
import { ResaleTransaction } from '../types.ts';
import { formatPrice, formatMonth, getLeaseNote } from '../utils/hdb.ts';
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Layers,
  Maximize2,
  Clock,
  ShieldAlert,
  Tag,
  Home,
  FileText,
} from 'lucide-react';

interface DetailScreenProps {
  transaction: ResaleTransaction;
  onBack: () => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({
  transaction,
  onBack,
}) => {
  const leaseNote = getLeaseNote(transaction.lease_band);

  return (
    <div id="detail-screen" className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          id="detail-back-button"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 active:bg-stone-200 text-stone-900 text-sm font-semibold transition-all shadow-2xs touch-manipulation min-h-[44px]"
          aria-label="Back to search and results"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
          <span>Back to results</span>
        </button>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-6">
        {/* Header Section */}
        <div className="bg-stone-900 text-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-xs font-bold tracking-wider uppercase">
              {transaction.town}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-200 text-xs font-semibold">
              {transaction.flat_type}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-xs">
              {transaction.flat_model}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
            Block {transaction.block} {transaction.street_name}
          </h2>
          <p className="text-sm text-stone-400">
            Registered transaction in {transaction.town}, Singapore
          </p>

          <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Resale Transaction Price
            </span>
            <span
              id="detail-resale-price"
              className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight"
            >
              {formatPrice(transaction.resale_price_num)}
            </span>
          </div>
        </div>

        {/* Full 11-field Record Grid */}
        <div className="p-5 sm:p-7">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-4 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-stone-600" />
            <span>Full Transaction Record</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* 1. Town */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-stone-600" />
                Town
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.town}
              </span>
            </div>

            {/* 2. Street Name */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-stone-600" />
                Street Name
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.street_name}
              </span>
            </div>

            {/* 3. Block */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Home className="w-3.5 h-3.5 text-stone-600" />
                Block Number
              </span>
              <span className="font-bold text-stone-900 text-base">
                Block {transaction.block}
              </span>
            </div>

            {/* 4. Flat Type */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-stone-600" />
                Flat Type
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.flat_type}
              </span>
            </div>

            {/* 5. Flat Model */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-stone-600" />
                Flat Model
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.flat_model}
              </span>
            </div>

            {/* 6. Storey Range */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                Storey Range
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.storey_range}
                <span className="text-xs font-normal text-stone-600 ml-1.5">
                  ({transaction.storey_band})
                </span>
              </span>
            </div>

            {/* 7. Floor Area in sqm */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                Floor Area
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.floor_area_sqm} sqm
              </span>
            </div>

            {/* 8. Lease Commence Date */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                Lease Commence Date
              </span>
              <span className="font-bold text-stone-900 text-base">
                Year {transaction.lease_commence_date}
              </span>
            </div>

            {/* 9. Remaining Lease */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                Remaining Lease
              </span>
              <span className="font-bold text-stone-900 text-base">
                {transaction.remaining_lease}
              </span>
            </div>

            {/* 10. Month of Sale */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                Month of Sale
              </span>
              <span className="font-bold text-stone-900 text-base">
                {formatMonth(transaction.month)}
                <span className="text-xs font-normal text-stone-600 ml-1.5">
                  ({transaction.month})
                </span>
              </span>
            </div>

            {/* 11. Resale Price */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 sm:col-span-2">
              <span className="text-xs font-semibold text-stone-600 mb-1 block">
                Recorded Resale Price
              </span>
              <span className="font-extrabold text-stone-900 text-xl">
                {formatPrice(transaction.resale_price_num)}
              </span>
            </div>
          </div>

          {/* Lease Band Plain-English Note */}
          <div
            id="lease-information-note"
            className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                  Lease Considerations ({transaction.lease_band})
                </h4>
                <p className="text-sm font-medium text-stone-800 leading-relaxed">
                  {leaseNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Back Button for Phone convenience */}
      <div className="text-center pb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-sm font-semibold transition-all shadow-xs min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to search results</span>
        </button>
      </div>
    </div>
  );
};
