const StructuredData = ({ data }) => {
    const payload = Array.isArray(data) ? data : [data];

    return payload.map((entry, index) => (
        <script
            key={`structured-data-${index}`}
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
    ));
};

export default StructuredData;
