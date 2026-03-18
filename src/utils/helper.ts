import _ from 'lodash';
import dayjs from 'dayjs';


export const setCookie = (cname: any, cvalue: any, exdays: any) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export const getCookie = (cname: any) => {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const checkCookie = (cname: any) => {
  const user = getCookie(cname);
  if (user !== "") {
    return true;
  } else {
    /*  user = prompt("Please enter your name:", "");
     if (user != "" && user != null) {
       setCookie("username", user, 365);
     } */
    return false;
  }
}

export const deleteCookie = (cname: any) => {
  document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const getCurrentUser = (): { [key: string]: any } | null => {
  const userData = localStorage.getItem('brta360_user');
  if (!userData) {
    return null;
  }

  try {
    const user = JSON.parse(userData);
    return user;
  } catch (error) {
    console.error("Failed to parse user data", error);
    return null;
  }
};

export const setCurrentUser = (user: any) => {
  try {
    if (user) {
      localStorage.setItem('brta360_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('brta360_user');
    }
  } catch (error) {
    console.error("Failed to set user data", error);
  }
};

export const isAuthenticated = !!getCurrentUser()


export function capitalizeFirstWord(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



export const getParams = (params: any) => {
  return {
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  };
}

type Permission = {
  name: string;
};

/**
 * Checks if the current user is a super admin.
 * @returns `true` if the user is a super admin, otherwise `false`.
 */
export const isSuperAdmin = (): boolean => {
  try {
    const userData: any = localStorage.getItem('brta360_user');
    if (!userData) return false;

    let user: any = JSON.parse(userData)?.user;
    if (!user) {
      user = JSON.parse(userData);
    }
    return (
      user.id === 1 &&
      (user.roles?.[0]?.name.toLowerCase() === 'super admin')
    );
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return false;
  }
};

export const isMember = (): any => {
  try {
    const userData: any = localStorage.getItem('brta360_user');
    if (!userData) return false;

    let user: any = JSON.parse(userData)?.user;
    if (!user) {
      user = JSON.parse(userData);
    }
    let roles = user?.roles || []; // Ensure roles is always an array

    const roleNames = roles.map((role: any) => role.name);

    return roleNames.includes('Member')
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return false;
  }
};
/**
 * Checks if the user has a specific permission.
 * @param permissions - List of user permissions.
 * @param permission - The specific permission to check.
 * @returns `true` if the user has the permission or is a super admin, otherwise `false`.
 */
export const isPermission = (permissions: Permission[] = [], permission: string): boolean => {
  if (isSuperAdmin()) return true;
  return permissions?.some((item: any) => item === permission);
};

export const isRole = (permissions: Permission[] = [], permission: string): boolean => {
  if (isSuperAdmin()) return true;
  return permissions?.some((item: any) => item === permission);
};

/**
 * Checks if the user has any permission from a list of permissions.
 * @param permissions - List of user permissions.
 * @param requiredPermissions - List of permissions to check against.
 * @returns `true` if the user has at least one of the permissions or is a super admin, otherwise `false`.
 */
export const isAnyPermission = (
  permissions: Permission[] = [],
  requiredPermissions: string[] = []
): boolean => {

  if (isSuperAdmin()) return true;
  if (permissions.length > 0) {
    return permissions?.some((item: any) => requiredPermissions.includes(item));
  }
  return false;
};

export const isAnyRole = (
  permissions: Permission[] = [],
  requiredRoles: string[] = []
): boolean => {
  if (isSuperAdmin()) return true;

  if (permissions.length > 0) {
    return permissions?.some((item: any) => requiredRoles.includes(item));
  }
  return false;
};

export const getStatuses = () => {
  const data = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'In-Active' },
  ]

  return data
}

export const getServiceRequestStatuses = () => {
  const data = [
    { value: 'in progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
  ]

  return data
}

export const getBookAmenityStatuses = () => {
  const data = [
    { value: 'in progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
  ]

  return data
}

export const formFieldErrors = (e: any, setError: any) => {
  for (let key in e?.response?.data?.data) {
    if (e?.response?.data?.data.hasOwnProperty(key)) {
      let validateMessage: any = Object.values(e?.response?.data?.data[key]);
      setError(key, {
        type: "manual",
        message: capitalizeFirstWord(validateMessage?.[0]),
      })
    }
  }
}

export const affiliationGroupByYear = (e: any) => {
  if (e) {
    const groupedByYear = e.reduce((acc: any, curr: any) => {
      const { year, name, costPrice, sellingPrice } = curr;

      if (!acc[year]) {
        acc[year] = { year };
      }

      acc[year][name] = { costPrice, sellingPrice };
      return acc;
    }, {});

    // Step 2: Convert grouped object to an array
    const output = Object.values(groupedByYear);
    return output;
  }
  return []

}


export const usdFormat = (price: any, withSymbol: boolean = true) => {
  const USDollar = new Intl.NumberFormat('en-US', {
    style: withSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (!price) {
    return USDollar.format(0);
  }

  return USDollar.format(price);
}


export const parseNumber = (val: string | number) => {
  if (val) {
    if (typeof val === "number") return val;
    return parseFloat(val.replace(/,/g, ""));
  }

};


export const isObject = (data: any) => {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}


export const mimeTypes = () => {
  const mimeTypeFilters: any = {
    images: [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
      "image/tiff",
    ],
    videos: [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "video/webm",
      "video/ogg",
    ],
    audios: [
      "audio/mpeg",
      "audio/ogg",
      "audio/wav",
      "audio/x-ms-wma",
      "audio/aac",
      "audio/flac",
      "audio/mp4",
    ],
    documents: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-word.document.macroEnabled.12",
      "application/vnd.ms-word.template.macroEnabled.12",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.apple.pages",
      "application/pdf",
      "application/vnd.ms-xpsdocument",
      "application/oxps",
      "application/rtf",
      "application/wordperfect",
      "application/octet-stream",
    ],
    spreadsheets: [
      "application/vnd.apple.numbers",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    ],
    archives: [
      "application/x-gzip",
      "application/rar",
      "application/x-tar",
      "application/zip",
      "application/x-7z-compressed",
    ],
  };
  return mimeTypeFilters;
}

export const mediaTypeFilter = () => {
  const mediaFilters = [
    { label: "All media items", value: "all" },
    { label: "Images", value: "images" },
    { label: "Audio", value: "audios" },
    { label: "Video", value: "videos" },
    { label: "Documents", value: "documents" },
    { label: "Spreadsheets", value: "spreadsheets" },
    { label: "Archives", value: "archives" },
  ];
  return mediaFilters;
}

export const extractArrayColumn = (data: any, column: string) => {
  return _.map(data, column)
}

export const filterSelectedMedallionMonths = (
  fullData: any[],
  selectedData: any // { "1240": ["Jan", ...] }
): any[] => {
  return Object.entries(selectedData)
    .map(([medallionNumber, months]: any) => {
      const fullItem = fullData.find(item => item.medallionNumber === medallionNumber);
      if (!fullItem) return null;

      const filteredMonths = fullItem.months.filter((monthItem: any) =>
        months?.months?.includes(monthItem.month)
      );

      return {
        ...fullItem,
        months: filteredMonths,
      };
    })
    .filter(Boolean); // remove null if any
};


export const groupByYear = (rawData: any[]) => {
  const data = Array.isArray(rawData) ? rawData : Object.values(rawData);

  return data.reduce((acc, item) => {
    // extract year from effectiveDate
    const year = item.effectiveDate ? dayjs(item.effectiveDate).year() : 'Unknown';

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(item);
    return acc;
  }, {} as Record<string, any[]>);
};