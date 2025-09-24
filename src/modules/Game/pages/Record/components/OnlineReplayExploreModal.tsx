import React, { useState, useEffect, useCallback } from 'react';
import { IoClose, IoCalendar, IoTrophy, IoPerson, IoTime, IoChevronForward, IoRefresh } from 'react-icons/io5';
import { searchRecords, Record, Pagination, RecordsSearchResponse } from '../../../../../context';

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
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [todayRecords, setTodayRecords] = useState<Record[]>([]);
  const [maxScoreRecords, setMaxScoreRecords] = useState<Record[]>([]);
  const [myReplays, setMyReplays] = useState<Record[]>([]);
  
  // Pagination states
  const [todayPagination, setTodayPagination] = useState<Pagination>({ limit: 10, offset: 0, total: 0, hasMore: false });
  const [maxScorePagination, setMaxScorePagination] = useState<Pagination>({ limit: 10, offset: 0, total: 0, hasMore: false });
  const [myReplaysPagination, setMyReplaysPagination] = useState<Pagination>({ limit: 10, offset: 0, total: 0, hasMore: false });
  

  // API call for search endpoint
  const fetchSearchRecords = useCallback(async (startDate?: string, endDate?: string, limit = 10, offset = 0): Promise<RecordsSearchResponse> => {
    try {
      const response = await searchRecords({
        startDate,
        endDate,
        limit,
        offset
      });
      return response;
    } catch (error) {
      console.error('Error fetching search records:', error);
      return { pagination: { limit, offset, total: 0, hasMore: false }, filters: {}, records: [] };
    }
  }, []);


  // Load today's records
  const loadTodayRecords = useCallback(async (offset = 0, append = false) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      // Use search endpoint with startDate and endDate for today's records
      const response = await fetchSearchRecords(today, today, 10, offset);
      
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
    }
  }, [fetchSearchRecords]);

  // Load max score records
  const loadMaxScoreRecords = useCallback(async (offset = 0, append = false) => {
    setLoading(true);
    try {
      // For max scores, we can use search without date range or with a wide date range
      const response = await fetchSearchRecords(undefined, undefined, 10, offset);
      
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
    }
  }, [fetchSearchRecords]);

  // Load my replays
  const loadMyReplays = useCallback(async (offset = 0, append = false) => {
    setLoading(true);
    try {
      // This would typically include user authentication
      const response = await fetchSearchRecords(undefined, undefined, 10, offset);
      
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
    }
  }, [fetchSearchRecords]);

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

  // Handle pagination
  const handleLoadMore = useCallback(() => {
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
  }, [activeSection, todayPagination, maxScorePagination, myReplaysPagination, loadTodayRecords, loadMaxScoreRecords, loadMyReplays]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Explore Online Replays</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { key: 'today', label: 'Today\'s Replays', icon: IoCalendar },
            { key: 'maxScores', label: 'Max Scores', icon: IoTrophy },
            { key: 'myReplays', label: 'My Replays', icon: IoPerson }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as SectionType)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === key
                  ? 'text-white border-b-2 border-white bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>


        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && getCurrentRecords().length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentRecords().map((record) => {
                const isSelected = selectedRecordId === record.uuid;
                return (
                  <div
                    key={record.uuid}
                    className={`p-4 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-gray-700/70 border-gray-500 cursor-wait'
                        : 'bg-gray-800/50 border-gray-600 hover:border-gray-500 cursor-pointer'
                    }`}
                    onClick={() => !isSelected && handleRecordSelect(record)}
                  >
                    {isSelected ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <IoRefresh className="text-white animate-spin" size={32} />
                          <span className="text-white text-sm">Loading record...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <IoPerson size={20} />
                          <span className="truncate">{record.user.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IoTrophy size={20} />
                          <span>Score: {record.score.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IoTime size={20} />
                          <span>{record.playTime}ms • {record.move} moves</span>
                        </div>
                        <div className="text-gray-400 text-sm">{record.date}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {getCurrentPagination().hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    <IoChevronForward size={16} />
                    Load More
                  </>
                )}
              </button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center mt-4 text-gray-400 text-sm">
            Showing {getCurrentRecords().length} of {getCurrentPagination().total} records
          </div>
        </div>
      </div>
    </div>
  );
};
