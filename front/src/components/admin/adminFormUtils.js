export function normalizeText(value) {
    return String(value ?? '').trim();
}

export const emptyProjectForm = {
    img: '',
    href: '',
    categoryUa: '',
    categoryEn: '',
    titleUa: '',
    titleEn: '',
    summaryUa: '',
    summaryEn: '',
};

export const emptyMediaForm = {
    img: '',
    typeUa: '',
    typeEn: '',
    titleUa: '',
    titleEn: '',
    sourceUrl: '',
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
        img: mediaItem?.img || '',
        typeUa: mediaItem?.type?.ua || '',
        typeEn: mediaItem?.type?.en || '',
        titleUa: mediaItem?.title?.ua || '',
        titleEn: mediaItem?.title?.en || '',
        sourceUrl: mediaItem?.sourceUrl || '',
        summaryUa: mediaItem?.summary?.ua || '',
        summaryEn: mediaItem?.summary?.en || '',
    };
}

export function buildProjectPayload(form) {
    return {
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
    };
}
