import Link from 'next/link';
import styles from '../styles/Home.module.css';

function pageHref(page: number): string {
    return page === 1 ? '/' : `/page/${page}`;
}

// Numbered pager: Previous | 1 | 2 | … | N | Next.
function pageNumbers(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (current > 3) pages.push('…');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
        pages.push(p);
    }
    if (current < total - 2) pages.push('…');
    pages.push(total);
    return pages;
}

interface Props {
    currentPage: number;
    totalPages: number;
}

// Hidden when there is a single page.
export default function Pager({ currentPage, totalPages }: Props) {
    if (totalPages <= 1) return null;
    const numbers = pageNumbers(currentPage, totalPages);
    return (
        <nav className={styles.pager} aria-label="Pagination">
            {currentPage > 1 ? (
                <Link href={pageHref(currentPage - 1)}>
                    <a className={styles.pagerLink}>← Previous</a>
                </Link>
            ) : (
                <span className={styles.pagerDisabled}>← Previous</span>
            )}
            {numbers.map((p, i) =>
                p === '…' ? (
                    <span key={`ellipsis-${i}`} className={styles.pagerEllipsis}>…</span>
                ) : p === currentPage ? (
                    <span key={p} className={styles.pagerCurrent}>{p}</span>
                ) : (
                    <Link key={p} href={pageHref(p as number)}>
                        <a className={styles.pagerLink}>{p}</a>
                    </Link>
                ),
            )}
            {currentPage < totalPages ? (
                <Link href={pageHref(currentPage + 1)}>
                    <a className={styles.pagerLink}>Next →</a>
                </Link>
            ) : (
                <span className={styles.pagerDisabled}>Next →</span>
            )}
        </nav>
    );
}
