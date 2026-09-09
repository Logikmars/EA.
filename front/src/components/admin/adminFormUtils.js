export function normalizeText(value) {
    return String(value ?? '').trim();
}

export const emptyProjectForm = {
    order: '1',
    img: '',
    href: '',
    categoryUa: 'Загальне',
    categoryEn: 'General',
    titleUa: '',
    titleEn: '',
    summaryUa: '',
    summaryEn: '',
};

export const emptyMediaForm = {
    order: '1',
    img: '',
    typeUa: '',
    typeEn: '',
    titleUa: '',
    titleEn: '',
    sourceUrl: '',
    publishedAt: '',
    summaryUa: '',
    summaryEn: '',
};

export function updateFormValue(setForm, field, value) {
    setForm((currentValue) => ({
        ...currentValue,
        [field]: value,
    }));
}

export function mapProjectToForm(project) {
    return {
        order: String(project?.order || 1),
        img: project?.img || '',
        href: project?.href || '',
        categoryUa: project?.category?.ua || '',
        categoryEn: project?.category?.en || '',
        titleUa: project?.title?.ua || '',
        titleEn: project?.title?.en || '',
        summaryUa: project?.summary?.ua || '',
        summaryEn: project?.summary?.en || '',
    };
}

export function mapMediaToForm(mediaItem) {
    return {
        order: String(mediaItem?.order || 1),
        img: mediaItem?.img || '',
        typeUa: mediaItem?.type?.ua || '',
        typeEn: mediaItem?.type?.en || '',
        titleUa: mediaItem?.title?.ua || '',
        titleEn: mediaItem?.title?.en || '',
        sourceUrl: mediaItem?.sourceUrl || '',
        publishedAt: mediaItem?.publishedAt
            ? String(mediaItem.publishedAt).slice(0, 10)
            : '',
        summaryUa: mediaItem?.summary?.ua || '',
        summaryEn: mediaItem?.summary?.en || '',
    };
}

export function buildProjectPayload(form) {
    return {
        order: Number(form.order),
        img: normalizeText(form.img) || '/imgs/projects/1.png',
        href: normalizeText(form.href),
        category: {
            ua: normalizeText(form.categoryUa),
            en: normalizeText(form.categoryEn),
        },
        title: {
            ua: normalizeText(form.titleUa),
            en: normalizeText(form.titleEn),
        },
        summary: {
            ua: normalizeText(form.summaryUa),
            en: normalizeText(form.summaryEn),
        },
    };
}

export function buildMediaPayload(form) {
    return {
        order: Number(form.order),
        img: normalizeText(form.img) || '/imgs/projects/1.png',
        type: {
            ua: normalizeText(form.typeUa),
            en: normalizeText(form.typeEn),
        },
        title: {
            ua: normalizeText(form.titleUa),
            en: normalizeText(form.titleEn),
        },
        summary: {
            ua: normalizeText(form.summaryUa),
            en: normalizeText(form.summaryEn),
        },
        outlet: '',
        sourceUrl: normalizeText(form.sourceUrl),
        publishedAt: normalizeText(form.publishedAt) || null,
    };
}
