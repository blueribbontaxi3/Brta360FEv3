import React, { useMemo, useState, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { notification, Button, Modal, Input, Space, Popconfirm, Tooltip, Spin, ColorPicker } from 'antd';
import { PlusOutlined, DeleteOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import axios from '../../../../utils/axiosInceptor';

interface KanbanBoardProps {
    // Removed tickets prop as we fetch internally
}

// Predefined colors for color picker
const PRESET_COLORS = [
    '#52c41a', '#faad14', '#1890ff', '#ff4d4f', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#2f54eb'
];

const KanbanBoard: React.FC<KanbanBoardProps> = () => {
    const navigate = useNavigate();
    const [activeTicket, setActiveTicket] = useState<any>(null);
    const [activeColumn, setActiveColumn] = useState<any>(null);
    const [localTickets, setLocalTickets] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [columnsLoading, setColumnsLoading] = useState(true);
    const [ticketsLoading, setTicketsLoading] = useState(false);

    // Modal state for adding new column
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [newColumnColor, setNewColumnColor] = useState('#1890ff');
    const [addingColumn, setAddingColumn] = useState(false);
    const [showColumnSettings, setShowColumnSettings] = useState(false);

    // Fetch tickets for all columns
    const fetchTicketData = async (currentColumns: any[]) => {
        if (!currentColumns.length) return;
        setTicketsLoading(true);
        try {
            const promises = currentColumns.map(col =>
                axios.get('/tickets', {
                    params: {
                        status: col.id,
                        pageSize: 100
                    }
                })
            );

            const results = await Promise.all(promises);
            const allTickets = results.flatMap(res => res.data?.data?.items || []);
            setLocalTickets(allTickets);
        } catch (error) {
            notification.error({ message: 'Failed to load tickets' });
        } finally {
            setTicketsLoading(false);
        }
    };

    // Fetch columns from API
    const fetchColumns = async () => {
        setColumnsLoading(true);
        try {
            const response = await axios.get('/tickets/statuses');
            const items = response.data?.data?.items || response.data?.data || [];
            // Map API response to our format
            const mappedColumns = items.map((item: any) => ({
                id: item.slug || item.id,
                dbId: item.id, // Keep database ID for API calls
                title: item.title,
                color: item.color || '#1890ff',
                order: item.order || 0
            }));
            // Sort by order
            mappedColumns.sort((a: any, b: any) => a.order - b.order);
            setColumns(mappedColumns);

            // Only fetch tickets if we have columns
            if (mappedColumns.length > 0) {
                fetchTicketData(mappedColumns);
            }
        } catch (error: any) {
            notification.error({
                message: 'Failed to load statuses',
                description: error?.response?.data?.message || 'Could not fetch ticket statuses'
            });
        } finally {
            setColumnsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchColumns();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group tickets by status
    // Note: Tickets are assumed to be sorted by order from the API
    const groupedTickets = useMemo(() => {
        const grouped: Record<string, any[]> = {};

        // Initialize all columns with empty arrays
        columns.forEach(col => {
            grouped[col.id] = [];
        });

        localTickets.forEach((ticket) => {
            const status = ticket.status?.toLowerCase() || columns[0]?.id || 'open';
            if (grouped[status]) {
                grouped[status].push(ticket);
            } else {
                // If ticket has unknown status, put in first column
                if (columns[0]?.id) {
                    grouped[columns[0].id]?.push(ticket);
                }
            }
        });

        return grouped;
    }, [localTickets, columns]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        // Check if dragging a column or a ticket
        if (active.data.current?.type === 'Column') {
            const column = columns.find(c => c.id === active.id);
            setActiveColumn(column);
            return;
        }

        const ticket = localTickets.find((t) => t.id === active.id);
        setActiveTicket(ticket);
        setActiveColumn(null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Visual feedback during drag
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTicket(null);
        setActiveColumn(null);

        if (!over) return;

        // Handling Column Reorder
        if (active.data.current?.type === 'Column') {
            if (active.id !== over.id) {
                const oldIndex = columns.findIndex((col) => col.id === active.id);
                const newIndex = columns.findIndex((col) => col.id === over.id);

                const newColumns = arrayMove(columns, oldIndex, newIndex);
                setColumns(newColumns);

                // API call to reorder columns
                try {
                    const orderedIds = newColumns.map(col => col.dbId);
                    await axios.put('/tickets/statuses/reorder', { order: orderedIds });
                } catch (error: any) {
                    notification.error({
                        message: 'Reorder Failed',
                        description: 'Could not save column order'
                    });
                    // Revert on failure if needed (optional, complexity vs UX trade-off)
                }
            }
            return;
        }

        // Handling Ticket Drag
        const ticketId = active.id;
        const ticket = localTickets.find((t) => t.id === ticketId);

        if (!ticket) return;

        // Determine the target column
        let targetStatus = over.id as string;

        // If dropped on a card, find its parent column
        if (!columns.some((c) => c.id === targetStatus)) {
            const overTicket = localTickets.find((t) => t.id === over.id);
            if (overTicket) {
                targetStatus = overTicket.status?.toLowerCase() || columns[0]?.id || 'open';
            }
            // Also handle case where we drop on a column but 'over.id' is the column ID
            if (active.data.current?.sortable?.containerId !== over.data.current?.sortable?.containerId) {
                // Logic handled by finding the column above
            }
        }

        // Ensure successful drop logic for tickets even if dropped on empty space in column
        const overColumn = columns.find(c => c.id === over.id);
        if (overColumn) {
            targetStatus = overColumn.id;
        }

        // If status hasn't changed (same column drop)
        if (ticket.status?.toLowerCase() === targetStatus) {
            // Check if position changed
            const oldIndex = localTickets.findIndex((t) => t.id === active.id);
            const newIndex = localTickets.findIndex((t) => t.id === over.id);

            if (oldIndex !== newIndex) {
                const newLocalTickets = arrayMove(localTickets, oldIndex, newIndex);
                setLocalTickets(newLocalTickets);

                // Prepare ordered IDs for this column
                // Note: We need to filter by current column to get correct relative order if backend expects full list
                // But typically reorder API expects just a list of IDs in desired order for a scope,
                // or we send all IDs.
                // Here, let's assume we send updated list of IDs for this specific status/column.

                const columnTicketIds = newLocalTickets
                    .filter(t => (t.status?.toLowerCase() || 'open') === targetStatus)
                    .map(t => t.id);

                try {
                    await axios.put('/tickets/reorder', {
                        status: targetStatus,
                        ids: columnTicketIds
                    });
                } catch (error: any) {
                    // Revert on failure
                    setLocalTickets(localTickets);
                    notification.error({ message: 'Failed to save ticket order' });
                }
            }
            return;
        }

        // Status changed (different column drop)
        // Optimistic update
        setLocalTickets((prev) =>
            prev.map((t) =>
                t.id === ticketId ? { ...t, status: targetStatus } : t
            )
        );

        // Call API to update ticket status
        try {
            // PATCH /tickets/:id/update-status with status in body
            await axios.patch(`/tickets/${ticketId}/update-status`, {
                status: targetStatus
            });
            notification.success({
                message: 'Status Updated',
                description: `Ticket moved to ${targetStatus.replace(/_/g, ' ').toUpperCase()}`,
                duration: 2,
            });
            // onTicketUpdate() removed as it is no longer passed as prop
            // We can just rely on the local state update we optimistically did, 
            // OR refetch. Given optimistic update is in place, we might not need to refetch immediately,
            // but for safety we can refetch just that ticket's column or all.
            // Let's stick to optimistic for now to be fast.
        } catch (error: any) {
            // Revert on failure
            setLocalTickets((prev) =>
                prev.map((t) =>
                    t.id === ticketId ? { ...t, status: ticket.status } : t
                )
            );
            notification.error({
                message: 'Update Failed',
                description: error?.response?.data?.message || 'Could not update ticket status',
            });
        }
    };

    const handleAddClick = () => {
        navigate('/ticket/create');
    };

    // Add new column via API
    const handleAddColumn = async () => {
        if (!newColumnTitle.trim()) {
            notification.warning({ message: 'Please enter a column title' });
            return;
        }

        setAddingColumn(true);
        try {
            const response = await axios.post('/tickets/statuses', {
                title: newColumnTitle,
                color: newColumnColor
            });

            if (response.data?.status === 1 || response.data?.data) {
                notification.success({ message: `Column "${newColumnTitle}" added` });
                setNewColumnTitle('');
                setNewColumnColor('#1890ff');
                setIsModalOpen(false);
                fetchColumns(); // Refresh columns
            } else {
                notification.error({ message: response.data?.message || 'Failed to add column' });
            }
        } catch (error: any) {
            notification.error({
                message: 'Failed to add column',
                description: error?.response?.data?.message || 'Could not create status'
            });
        } finally {
            setAddingColumn(false);
        }
    };

    // Remove column via API
    const handleRemoveColumn = async (column: any) => {
        // Check if there are tickets in it
        if (groupedTickets[column.id]?.length > 0) {
            notification.warning({
                message: 'Cannot remove column',
                description: 'Move all tickets to another column first'
            });
            return;
        }

        // Don't allow removing last column
        if (columns.length <= 1) {
            notification.warning({ message: 'Cannot remove the last column' });
            return;
        }

        try {
            await axios.delete(`/tickets/statuses/${column.dbId}`);
            notification.success({ message: 'Column removed' });
            fetchColumns(); // Refresh columns
        } catch (error: any) {
            notification.error({
                message: 'Failed to remove column',
                description: error?.response?.data?.message || 'Could not delete status'
            });
        }
    };

    if (columnsLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Spin size="large" tip="Loading board..." />
            </div>
        );
    }

    return (
        <>
            {/* Header with Add Column button */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '16px 0',
                gap: 8
            }}>
                <Tooltip title="Refresh">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchColumns}
                    />
                </Tooltip>
                <Tooltip title="Column Settings">
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => setShowColumnSettings(!showColumnSettings)}
                    >
                        Manage Columns
                    </Button>
                </Tooltip>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Column
                </Button>
            </div>

            {/* Column Settings Panel */}
            {showColumnSettings && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fafafa',
                    borderRadius: 8,
                    marginBottom: 16,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 500 }}>Current Columns:</span>
                    {columns.map(col => (
                        <Space key={col.id} size={4}>
                            <span style={{
                                padding: '4px 8px',
                                backgroundColor: col.color + '20',
                                borderRadius: 4,
                                borderLeft: `3px solid ${col.color}`
                            }}>
                                {col.title} ({groupedTickets[col.id]?.length || 0})
                            </span>
                            <Popconfirm
                                title="Remove this column?"
                                description="This action cannot be undone."
                                onConfirm={() => handleRemoveColumn(col)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    disabled={groupedTickets[col.id]?.length > 0}
                                />
                            </Popconfirm>
                        </Space>
                    ))}
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={columns.map(col => col.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: 16,
                            paddingBottom: 16,
                            overflowX: 'auto',
                            minHeight: 500,
                        }}
                    >
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                tickets={groupedTickets[column.id] || []}
                                color={column.color}
                                onAddClick={columns.indexOf(column) === 0 ? handleAddClick : undefined}
                                loading={ticketsLoading} // Pass loading state
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeColumn ? (
                        <div style={{ transform: 'rotate(2deg)' }}>
                            <KanbanColumn
                                id={activeColumn.id}
                                title={activeColumn.title}
                                tickets={groupedTickets[activeColumn.id] || []}
                                color={activeColumn.color}
                                isOverlay
                            />
                        </div>
                    ) : activeTicket ? (
                        <KanbanCard ticket={activeTicket} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Add Column Modal */}
            <Modal
                title="Add New Column"
                open={isModalOpen}
                onOk={handleAddColumn}
                onCancel={() => {
                    setIsModalOpen(false);
                    setNewColumnTitle('');
                    setNewColumnColor('#1890ff');
                }}
                okText="Add Column"
                confirmLoading={addingColumn}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Column Title</label>
                        <Input
                            placeholder="Enter column title (e.g., 'Review', 'QA Testing')"
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            onPressEnter={handleAddColumn}
                            size="large"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Column Color</label>
                        <ColorPicker
                            value={newColumnColor}
                            onChange={(color) => setNewColumnColor(color.toHexString())}
                            presets={[{ label: 'Recommended', colors: PRESET_COLORS }]}
                        />
                    </div>
                </Space>
            </Modal>
        </>
    );
};

export default KanbanBoard;
