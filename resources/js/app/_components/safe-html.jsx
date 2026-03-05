import DOMPurify from 'dompurify';

/**
 * SafeHTML Component
 * Sanitizes HTML content to prevent XSS attacks before rendering
 * 
 * Usage:
 *   <SafeHTML html={announcement.description} />
 */
export default function SafeHTML({ html, className = '' }) {
    const sanitizedHTML = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style'],
        ALLOW_DATA_ATTR: false
    });

    return (
        <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }} 
        />
    );
}
