'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import AdminPageShell from './AdminPageShell';
import adminStore from '@/stores/AdminStore';

const AdminProjectsListClient = observer(() => {
    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Delete this project?');

        if (!isConfirmed) {
            return;
        }

        await adminStore.deleteProject(id);
    };

    return (
        <AdminPageShell loadContent title='Projects'>
            <section className='AdminCard'>
                <div className='AdminCardHeader'>
                    <h2>Projects</h2>
                    <span>{adminStore.content.projects.length} items</span>
                </div>

                {adminStore.content.projects.length ? (
                    <div className='AdminList'>
                        {adminStore.content.projects.map((project) => (
                            <article className='AdminListItem' key={project.id}>
                                <div className='AdminListItemMain'>
                                    <strong>{project.title?.en || project.title?.ua || 'Untitled project'}</strong>
                                    <span>Display order: {project.order || 'Not set'}</span>
                                    <span>{project.href || 'No link'}</span>
                                </div>
                                <div className='AdminListItemActions'>
                                    <Link className='AdminButton AdminButton__secondary AdminButton__small' href={`/admin/projects/edit?id=${encodeURIComponent(project.id)}`}>
                                        Edit
                                    </Link>
                                    <button
                                        className='AdminButton AdminButton__danger AdminButton__small'
                                        onClick={() => handleDelete(project.id)}
                                        type='button'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className='AdminEmptyState'>No projects</div>
                )}
            </section>
        </AdminPageShell>
    );
});

export default AdminProjectsListClient;
