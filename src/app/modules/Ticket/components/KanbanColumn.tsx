import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Typography, Badge, Spin } from 'antd';
import { PlusOutlined, DragOutlined } from '@ant-design/icons';
import KanbanCard from './KanbanCard';

const { Text } = Typography;

interface KanbanColumnProps {
    id: string;
    title: string;
    tickets: any[];
    color: string;
    onAddClick?: () => void;
    isOverlay?: boolean;
    loading?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tickets, color, onAddClick, isOverlay, loading }) => {
    const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
        id,
        data: {
            type: 'Column',
        }
    });

    const {
        setNodeRef: setSortableNodeRef,
        attributes,
        listeners,
        transform,
        isDragging,
    } = useSortable({
        id,
        data: {
            type: 'Column',
        },
    });

    const style: React.CSSProperties = {
        flex: '0 0 320px', // Fixed width for horizontal scrolling
        minWidth: 320,
        backgroundColor: isOver ? '#f0f5ff' : '#fafafa',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.2s ease',
        opacity: isDragging ? 0.3 : 1,
        transform: CSS.Translate.toString(transform),
        height: '100%',
        boxShadow: isOverlay ? '0 10px 20px rgba(0,0,0,0.1)' : undefined,
        border: isOverlay ? '1px solid #d9d9d9' : undefined,
    };

    const headerStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderBottom: `3px solid ${color}`,
        backgroundColor: '#fff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'grab',
    };

    const contentStyle: React.CSSProperties = {
        padding: '12px',
        flex: 1,
        overflowY: 'auto',
        minHeight: 100,
    };

    return (
        <div ref={setSortableNodeRef} style={style}>
            <div
                style={headerStyle}
                {...attributes}
                {...listeners}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DragOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />
                    <Text strong style={{ fontSize: 14 }}>{title}</Text>
                    <Badge count={tickets.length} style={{ backgroundColor: color }} />
                </div>
                {id === 'open' && onAddClick && (
                    <PlusOutlined
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start when clicking add
                            onAddClick();
                        }}
                    />
                )}
            </div>

            <div
                ref={setDroppableNodeRef}
                style={contentStyle}
            >
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : (
                    <>
                        <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                            {tickets.map((ticket) => (
                                <KanbanCard key={ticket.id} ticket={ticket} />
                            ))}
                        </SortableContext>

                        {tickets.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 16px',
                                color: '#bfbfbf',
                                border: '2px dashed #e8e8e8',
                                borderRadius: 8,
                            }}>
                                <Text type="secondary">No tickets</Text>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
