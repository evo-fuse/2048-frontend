import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCalendar, IoTrophy, IoPerson, IoTime, IoRefresh } from 'react-icons/io5';
import { searchRecords, Record, Pagination, RecordsSearchResponse } from '../../../../../context';
import { ModalHeader } from '../../../../common/components/ModalHeader';

interface OnlineReplayExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: Record) => void;
}

type SectionType = 'today' | 'maxScores' | 'myReplays';

export const OnlineReplayExploreModal: React.FC<OnlineReplayExploreModalProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
}) => {
  const [activeSection, setActiveSection] = useState<SectionType>('today');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [todayRecords, setTodayRecords] = useState<Record[]>([]);
  const [maxScoreRecords, setMaxScoreRecords] = useState<Record[]>([]);
  const [myReplays, setMyReplays] = useState<Record[]>([]);

  // Pagination states
  const [todayPagination, setTodayPagination] = useState<Pagination>({ limit: 10, offset: 0, total: 0, hasMore: false });
  const [maxScorePagination, setMaxScorePagination] = useState<Pagination>({ limit: 10, offset: 0, total: 0, hasMore: false });
  const [myReplaysPagination, setMyReplaysPagination] = useState<Pagination>({ limit: 10, offset: 0, total: 0, hasMore: false });

  // Ref for infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);


  // API call for search endpoint
  const fetchSearchRecords = useCallback(async (
    startDate?: string, 
    endDate?: string, 
    sortBy?: string,
    sortOrder?: string,
    myRecordsOnly?: boolean,
    limit = 10, 
    offset = 0
  ): Promise<RecordsSearchResponse> => {
    try {
      const params: any = {
        limit,
        offset
      };
      
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      if (myRecordsOnly !== undefined) params.myRecordsOnly = myRecordsOnly.toString();
      
      const response = await searchRecords(params);
      return response;
    } catch (error) {
      console.error('Error fetching search records:', error);
      return { pagination: { limit, offset, total: 0, hasMore: false }, filters: {}, records: [] };
    }
  }, []);


  // Load today's records - all replays from today, sorted by date
  const loadTodayRecords = useCallback(async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      // Get all records from today (not just user's), sorted by date descending
      const response = await fetchSearchRecords(today, today, 'date', 'desc', false, 10, offset);

      if (append) {
        setTodayRecords(prev => [...prev, ...response.records]);
      } else {
        setTodayRecords(response.records);
      }
      setTodayPagination(response.pagination);
    } catch (error) {
      console.error('Error loading today records:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [fetchSearchRecords]);

  // Load max score records - all replays sorted by score descending
  const loadMaxScoreRecords = useCallback(async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      // Get all records sorted by score descending (highest scores first)
      const response = await fetchSearchRecords(undefined, undefined, 'score', 'desc', false, 10, offset);

      if (append) {
        setMaxScoreRecords(prev => [...prev, ...response.records]);
      } else {
        setMaxScoreRecords(response.records);
      }
      setMaxScorePagination(response.pagination);
    } catch (error) {
      console.error('Error loading max score records:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [fetchSearchRecords]);

  // Load my replays - only current user's replays sorted by date
  const loadMyReplays = useCallback(async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      // Get only the current user's records, sorted by date descending
      const response = await fetchSearchRecords(undefined, undefined, 'date', 'desc', true, 10, offset);

      if (append) {
        setMyReplays(prev => [...prev, ...response.records]);
      } else {
        setMyReplays(response.records);
      }
      setMyReplaysPagination(response.pagination);
    } catch (error) {
      console.error('Error loading my replays:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [fetchSearchRecords]);

  // Handle pagination (for infinite scroll)
  const handleLoadMore = useCallback(() => {
    if (loadingMore) return; // Prevent multiple simultaneous requests

    switch (activeSection) {
      case 'today':
        if (todayPagination.hasMore) {
          loadTodayRecords(todayPagination.offset + todayPagination.limit, true);
        }
        break;
      case 'maxScores':
        if (maxScorePagination.hasMore) {
          loadMaxScoreRecords(maxScorePagination.offset + maxScorePagination.limit, true);
        }
        break;
      case 'myReplays':
        if (myReplaysPagination.hasMore) {
          loadMyReplays(myReplaysPagination.offset + myReplaysPagination.limit, true);
        }
        break;
    }
  }, [activeSection, todayPagination, maxScorePagination, myReplaysPagination, loadTodayRecords, loadMaxScoreRecords, loadMyReplays, loadingMore]);

  // Load data when section changes
  useEffect(() => {
    if (!isOpen) return;

    switch (activeSection) {
      case 'today':
        loadTodayRecords();
        break;
      case 'maxScores':
        loadMaxScoreRecords();
        break;
      case 'myReplays':
        loadMyReplays();
        break;
    }
  }, [activeSection, isOpen, loadTodayRecords, loadMaxScoreRecords, loadMyReplays]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !loadingMore) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px', // Trigger 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isOpen, loading, loadingMore, handleLoadMore]);

  // Handle record selection with loading state
  const handleRecordSelect = useCallback(async (record: Record) => {
    if (!record.uuid) return;

    setSelectedRecordId(record.uuid);

    try {
      // Simulate loading time - replace with actual data loading logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call the parent's onSelectRecord function
      onSelectRecord(record);
      onClose();
    } catch (error) {
      console.error('Error loading record:', error);
    } finally {
      setSelectedRecordId(null);
    }
  }, [onSelectRecord, onClose]);

  // Get current records and pagination based on active section
  const getCurrentRecords = () => {
    switch (activeSection) {
      case 'today': return todayRecords;
      case 'maxScores': return maxScoreRecords;
      case 'myReplays': return myReplays;
      default: return [];
    }
  };

  const getCurrentPagination = () => {
    switch (activeSection) {
      case 'today': return todayPagination;
      case 'maxScores': return maxScorePagination;
      case 'myReplays': return myReplaysPagination;
      default: return { limit: 10, offset: 0, total: 0, hasMore: false };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="online-replay-explore-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020c16]/90 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="border border-cyan-400/25 bg-gradient-to-b from-[#042035]/95 via-[#020f1c]/95 to-[#01070d]/95 shadow-[0_20px_50px_rgba(0,255,255,0.2)] rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col relative"
          >
            {/* Header */}
            <ModalHeader title="Explore Online Replays" onClose={onClose} />

            {/* Section Tabs */}
            <div className="flex border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/10 to-transparent">
              {[
                { key: 'today', label: 'Today\'s Replays', icon: IoCalendar },
                { key: 'maxScores', label: 'Max Scores', icon: IoTrophy },
                { key: 'myReplays', label: 'My Replays', icon: IoPerson }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as SectionType)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeSection === key
                      ? 'text-cyan-50 border-b-2 border-cyan-400 bg-cyan-900/40'
                      : 'text-cyan-300/70 hover:text-cyan-100 hover:bg-cyan-900/20'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-cyan-500/5 p-6">
              {loading && getCurrentRecords().length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <IoRefresh className="text-cyan-400 animate-spin" size={32} />
                    <span className="text-cyan-100">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCurrentRecords().map((record) => {
                      const isSelected = selectedRecordId === record.uuid;
                      return (
                        <motion.div
                          key={record.uuid}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? 'bg-cyan-900/40 border-cyan-400/50 cursor-not-allowed shadow-lg shadow-cyan-500/20'
                              : 'bg-gradient-to-br from-[#042035]/80 to-[#020f1c]/80 border-cyan-400/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer'
                          }`}
                          onClick={() => !isSelected && handleRecordSelect(record)}
                        >
                          {isSelected ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="flex flex-col items-center gap-3">
                                <IoRefresh className="text-cyan-400 animate-spin" size={32} />
                                <span className="text-cyan-100 text-sm">Loading record...</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <IoPerson className="text-cyan-400" size={20} />
                                <span className="truncate text-cyan-50">{record.user.address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IoTrophy className="text-cyan-400" size={20} />
                                <span className="text-cyan-100">Score: {record.score.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IoTime className="text-cyan-400" size={20} />
                                <span className="text-cyan-100">{record.playTime}ms • {record.move} moves</span>
                              </div>
                              <div className="text-cyan-300/70 text-sm">{record.date}</div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Infinite scroll trigger element */}
                  {getCurrentPagination().hasMore && (
                    <div ref={observerTarget} className="flex justify-center mt-6 py-4">
                      {loadingMore && (
                        <div className="flex flex-col items-center gap-2">
                          <IoRefresh className="text-cyan-400 animate-spin" size={24} />
                          <span className="text-cyan-300/70 text-sm">Loading more...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pagination Info */}
                  <div className="text-center mt-4 text-cyan-300/70 text-sm">
                    Showing {getCurrentRecords().length} of {getCurrentPagination().total} records
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
